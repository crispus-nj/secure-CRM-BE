import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-events.dto';
import { UpdateEventsDto } from './dto/update-events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventsDto: CreateEventsDto, @Req() req: any) {
    return this.eventsService.createEvent(createEventsDto, req);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.eventsService.findAll();
  }

  // only users with the 'Admin', 'Project Manager' role can get a user by ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findEventById(id);
  }

  // only users with the 'Admin' role can update a user by ID
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateEventsDto: UpdateEventsDto) {
    return this.eventsService.update(id, updateEventsDto);
  }
}