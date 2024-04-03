import { Logger } from '@nestjs/common';
import { Event } from '@prisma/client';
import { EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { EventEntity } from 'src/@core/domain/Events/event.entity';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
const logger = new Logger('Create Event Use Case');

export class EventListUseCase {
  constructor(
    private _eventRepository: EventPrismaRepository
  ) {
  }
  async execute(
    body: Event
  ): Promise<{ status: number, success: boolean, data: any }> {
    try {
      const [page, limit] = [1, 5]
      return {
        status: 200,
        success: true,
        data: await this._eventRepository.findAll(page, limit)
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

  async findOneEvent(eventId: string) {
    try {
      const event: any = await this._eventRepository
        .findOne(eventId,
          {
            id: true,
            title: true,
            slug: true,
            details: true,
            maximumAttendees: true,
            _count: {
              select: {
                attendees: true
              }
            }
          }
        )
      if (event === null) {
        return {
          status: 404,
          success: false,
          data: 'Event not found.'
        }
      }
      const meta = {
        attendeesAmount: event._count.attendees,
        vacanciesAmount: Number(event.maximumAttendees) - Number(event._count.attendees)
      }
      delete event._count
      return {
        status: 200,
        success: true,
        data: { data: event, meta },
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
