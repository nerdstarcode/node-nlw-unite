import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DTOOutputService } from '../@core/DTO/response.service';
import { RedisClient } from 'src/@core/infra/Redis/RedisClient';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events.create-use-case';
import { CreateEventSchema, EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { Attendee } from '@prisma/client';
import { AttendeesRegistryUseCase } from 'src/@core/useCase/Attendees/attendees-registry-use-case';
import { AttendeeDTO } from 'src/@core/DTO/Attendees/attendees.dto';

const logger = new Logger('Attendees Service');

@Injectable()
export class AttendeesService {
  constructor(
    private _attendeeRegistryUseCase: AttendeesRegistryUseCase
  ) { }
  async registerAttendee(body: AttendeeDTO): Promise<DTOOutputService> {
    try {
      const create = await this._attendeeRegistryUseCase.execute(body as Attendee)
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
