import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DTOOutputService } from '../@core/DTO/response.service';
import { RedisClient } from 'src/@core/infra/Redis/RedisClient';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events-create.use-case';
import { CreateEventSchema, EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { Event } from '@prisma/client';
import { EventListUseCase } from 'src/@core/useCase/Events/events-list.use-case';

const logger = new Logger('Module Name');

@Injectable()
export class EventService {
  constructor(
    private _eventCreateUseCase: EventCreateUseCase,
    private _eventListUseCase: EventListUseCase
  ) { }

  async getEvent({ eventId }: { eventId: string }): Promise<DTOOutputService> {
    try {
      const response = await this._eventListUseCase.findOneEvent(eventId)
      return {
        status: response.status,
        message: response.data,
      }
    } catch (err) {
      console.error(err.message)
      return {
        status: 400,
        message: 'Error on get event',
      }
    }

  }

  async createEvent(body: EventDTO): Promise<DTOOutputService> {
    try {
      const create = await this._eventCreateUseCase.execute(body as Event)
      return {
        status: create.status,
        message: create.data,
      }

    } catch (err) {
      return {
        status: 400,
        message: err.message,
      }
    }

  }

}
