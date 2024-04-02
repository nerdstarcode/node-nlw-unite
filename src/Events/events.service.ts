import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DTOOutputService } from '../@core/DTO/response.service';
import { RedisClient } from 'src/@core/infra/Redis/RedisClient';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events.create-use-case';
import { CreateEventSchema, EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { Event } from '@prisma/client';

const logger = new Logger('Module Name');

@Injectable()
export class EventService {
  constructor(
    private _eventCreateUseCase: EventCreateUseCase
  ) { }

  async example(): Promise<DTOOutputService> {
    try {
      return {
        status: 200,
        message: 'success',
      }
    } catch (err) {
      return {
        status: 400,
        message: 'fail',
      }
    }

  }
  async createEvent(body: EventDTO): Promise<DTOOutputService> {
    try {
      const validateBody = this._validateEventSchema(body)
      if (validateBody.success) {
        const create = await this._eventCreateUseCase.execute(body as Event)
        return {
          status: create.status,
          message: create.data,
        }
      }
      return validateBody as DTOOutputService
    } catch (err) {
      return {
        status: 400,
        message: err.message,
      }
    }

  }
  _validateEventSchema(body) {
    try {
      return {
        success: true,
        body: CreateEventSchema.parse(body)
      }
    } catch (error) {
      return {
        status: 400,
        message: {
          describe: 'Invalid Entry',
          receive: body,
          error
        },
      }
    }
  }
}
