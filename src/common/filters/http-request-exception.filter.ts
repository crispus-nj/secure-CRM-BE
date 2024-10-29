import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpRequestExceptionFilter implements ExceptionFilter {
  // Catch exceptions and format the error response
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //  status code based on the type of exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Format the exception message
    const formattedResponse = this.formatError(exception);

    // Construct the error response object
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...formattedResponse, // Merged with the formatted message
    };

    // Send the formatted error response
    response.status(status).json(errorResponse);
  }

  // Format the error message and details
  private formatError(exception: any): { message: string; details?: string[] } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // If response is an object and has a message property
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        return {
          message: response.message as string,
          details: Array.isArray((response as any).message)
            ? (response as any).message
            : [(response as any).message],
        };
      }

      return { message: response as string };
    }

    if (exception instanceof QueryFailedError) {
      return this.formatDatabaseError(exception);
    }

    return { message: 'An unexpected error occurred' };
  }

  // Format specific database errors, such as unique constraint violations
  private formatDatabaseError(exception: QueryFailedError): {
    message: string;
    details?: string[];
  } {
    const driverError = exception.driverError as any;

    if (driverError.code === 'ER_DUP_ENTRY') {
      // Handle MySQL duplicate entry error
      const match = /Duplicate entry '(.*?)' for key '(.*?)'/.exec(
        driverError.message,
      );
      if (match) {
        const value = match[1];
        const field = match[2];
        return {
          message: `A user already exists with this ${field}`,
          details: [`Value '${value}' is already in use`],
        };
      }
    }

    return {
      message: 'Database error occurred',
      details: [driverError.message],
    };
  }
}
