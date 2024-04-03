import { Logger } from '@nestjs/common';
import { Attendee, Event } from '@prisma/client';
import { AttendeeEntity } from 'src/@core/domain/Attendees/attendees.entity';
import { AttendeePrismaRepository } from 'src/@core/infra/prisma/attendee.repository';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
const logger = new Logger('List Attendee Use Case');

export class AttendeesListUseCase {
  private Event: Event
  constructor(
    private _attendeesRepository: AttendeePrismaRepository,
    private _eventRepository: EventPrismaRepository
  ) {
  }
  async execute(
    body: Attendee
  ): Promise<{ status: number, success: boolean, data: any }> {
    try {
      const [page, limit] = [1, 5]
      return {
        status: 200,
        success: true,
        data: await this._attendeesRepository.findAll(page, limit)
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

  async getBadgeById(attendeeId: number) {
    try {
      const badge: any = await this._attendeesRepository
        .findOne(attendeeId,
          {
            name: true,
            email: true,
            event: {
              select: {
                title: true,
              }
            }
          }
        )
      if (badge === null) {
        return {
          status: 404,
          success: false,
          data: 'Badge not found.'
        }
      }
      const meta = { event: badge.event }
      delete badge.event
      return {
        status: 200,
        success: true,
        data: { data: badge, meta },
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
