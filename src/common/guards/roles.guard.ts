import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    /**
     * Determines if the current user has the required roles to access the route.
     * @param context - The execution context which provides details about the current request.
     * @returns A boolean, Promise, or Observable indicating if the user can activate the route.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.getRequiredRoles(context);
        
        if (!requiredRoles) {
            return true;
        }
        const user = this.getUserFromContext(context);
        return this.userHasRequiredRoles(user, requiredRoles);
    }

    /**
     * Retrieves the required roles for the route from the context.
     * @param context - The execution context which provides details about the current request.
     * @returns An array of required roles or undefined if no roles are required.
     */
    private getRequiredRoles(context: ExecutionContext): string[] | undefined {
        return this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    /**
     * Extracts the user object from the request context.
     * @param context - The execution context which provides details about the current request.
     * @returns The user object from the request.
     */
    private getUserFromContext(context: ExecutionContext): any {
        return context.switchToHttp().getRequest().user;
    }

    /**
     * Checks if the user has the required roles.
     * @param user - The user object containing user details and roles.
     * @param requiredRoles - An array of roles required to access the route.
     * @returns A boolean indicating if the user has one of the required roles.
     */
    private userHasRequiredRoles(user: any, requiredRoles: string[]): boolean {
        const userRoleName = user.role?.name;
        return requiredRoles.some((role) => userRoleName === role);
    }
}