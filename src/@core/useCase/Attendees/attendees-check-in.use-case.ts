import { Logger } from '@nestjs/common';
import { Attendee, Event } from '@prisma/client';
import { responseBadgeDTO } from 'src/@core/DTO/Attendees/attendees.dto';
import { AttendeeEntity } from 'src/@core/domain/Attendees/attendees.entity';
import { AttendeePrismaRepository } from 'src/@core/infra/prisma/attendee.repository';
import { CheckInPrismaRepository } from 'src/@core/infra/prisma/check-in.repository';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
const logger = new Logger('Check In Use Case');

export class CheckInUseCase {
  private Event: Event
  private Attendee: Attendee
  constructor(
    private _attendeesRepository: AttendeePrismaRepository,
    private _checkInRepository: CheckInPrismaRepository,
    private _eventRepository: EventPrismaRepository
  ) {
  }
  async execute(attendeeId: number): Promise<{ status: number, success: boolean, data: any }> {
    try {
      const userExists = await this._attendeesRepository.findOne(attendeeId)
      const AttendeeAlreadyRegister = await this._checkInRepository.findOne(attendeeId)
      if (AttendeeAlreadyRegister) {
        return {
          status: 400,
          success: false,
          data: 'Attendee already checked in!'
        }
      }
      if (userExists) {
        const checkIn = await this._checkInRepository.create({ attendeeId: attendeeId, createdAt: undefined, id: undefined })
        return {
          status: 201,
          success: true,
          data: { data: checkIn }
        }
      } else {
        return {
          status: 400,
          success: false,
          data: `user with id ${attendeeId} not exists`
        }
      }

    } catch (err) {
      console.error(err)
      return {
        status: 400,
        success: false,
        data: err.message
      }
    }
  }

}
