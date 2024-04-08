import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DTOOutputService } from '../@core/DTO/response.service';
import { RedisClient } from 'src/@core/infra/Redis/RedisClient';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events-create.use-case';
import { CreateEventSchema, EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { Attendee } from '@prisma/client';
import { AttendeesRegistryUseCase } from 'src/@core/useCase/Attendees/attendees-registry.use-case';
import { AttendeeDTO } from 'src/@core/DTO/Attendees/attendees.dto';
import { AttendeesListUseCase } from 'src/@core/useCase/Attendees/attendees-list.use-case';
import { CheckInUseCase } from 'src/@core/useCase/Attendees/attendees-check-in.use-case';

const logger = new Logger('Attendees Service');

@Injectable()
export class AttendeesService {
  constructor(
    private _attendeeRegistryUseCase: AttendeesRegistryUseCase,
    private _attendeeListUseCase: AttendeesListUseCase,
    private _attendeeCheckInUseCase: CheckInUseCase,
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
  async getAttendeeBadge({ attendeeId }: { attendeeId: number }): Promise<DTOOutputService> {
    try {
      const response = await this._attendeeListUseCase.getBadgeById(Number(attendeeId))
      return {
        status: response.status,
        message: response.data,
      }

    } catch (err) {
      return {
        status: 400,
        message: err.message,
      }
    }

  }

  async checkInAttendee({ attendeeId }: { attendeeId: number }): Promise<DTOOutputService> {
    try {
      const response = await this._attendeeCheckInUseCase.execute(Number(attendeeId))
      return {
        status: response.status,
        message: response.data,
      }

    } catch (err) {
      return {
        status: 400,
        message: err.message,
      }
    }

  }

}
