import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventsDto } from './dto/create-events.dto';
import { Events } from './entities/events.entity';
import { UpdateEventsDto } from './dto/update-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {}

  // Create a new event
  async createEvent(createEventsDto: CreateEventsDto, req: any): Promise<Events> {
    try {
      console.log("gets here ===> ");
      // Create a new event instance
      const event = this.eventsRepository.create(createEventsDto);
      console.log("gets here ===> 2 ");
      event.createdBy = req.user
      console.log("gets here ===> 3 ");
      // Save the event
      await this.eventsRepository.save(event);
      console.log("gets here ===> 4 ");

      // Return the event
      return event;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  // Get all event
  async findAll(): Promise<Events[]> {
    try {
      return await this.eventsRepository.find({
        relations: ['createdBy']
      }); // Get all event with their roles
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  // Get a event by ID
  async findEventById(id: number): Promise<Events> {
    try {
      const user = await this.eventsRepository.findOne({
        where: { id },
        relations: ['createdBy'],
      }); // Get a event by ID with their role
      if (!user) {
        throw new Error(`Account not found`);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update event details
  async update(id: number, updateEventsDto: UpdateEventsDto): Promise<Events> {
    try {
      // Find the event by ID
      const event = await this.findEventById(id);

      // Update the event details
      Object.assign(event, updateEventsDto);

      // Save the event
      await this.eventsRepository.save(event);

      // Return the event
      return event;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
