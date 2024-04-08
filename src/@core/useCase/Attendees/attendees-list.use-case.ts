import { Logger } from '@nestjs/common';
import { Attendee, Event } from '@prisma/client';
import { responseBadgeDTO } from 'src/@core/DTO/Attendees/attendees.dto';
import { AttendeeEntity } from 'src/@core/domain/Attendees/attendees.entity';
import { AttendeePrismaRepository } from 'src/@core/infra/prisma/attendee.repository';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
import { z } from 'zod';
import * as queryString from 'querystring'
const logger = new Logger('List Attendee Use Case');

export class AttendeesListUseCase {
  private Event: Event
  private baseURL: string = process.env.API_BASE_URL
  constructor(
    private _attendeesRepository: AttendeePrismaRepository,
    private _eventRepository: EventPrismaRepository
  ) {
  }
  async execute(
    filters: Attendee,
    page = 1,
    limit = 5
  ): Promise<{ status: number, success: boolean, data: any }> {
    try {
      const [attendees, count] = await Promise.all([
        this._attendeesRepository.findAll(page, limit, { ...filters, }),
        this._attendeesRepository.countTotal(filters)
      ])

      const prevParams = queryString.stringify({ ...filters as any, page: page - 1, limit })
      const currentParams = queryString.stringify({ ...filters as any, page: page, limit })
      const nextParams = queryString.stringify({ ...filters as any, page: page + 1, limit })

      const prevPage = page > 1 ? `${this.baseURL}/events/${filters.eventId}/attendees?${prevParams}` : undefined!
      const currentPage = `${this.baseURL}/events/${filters.eventId}/attendees?${currentParams}`
      const nextPage = count > (page * limit) ? `${this.baseURL}/events/${filters.eventId}/attendees?${nextParams}` : undefined!

      const attendeesMaped = attendees.map((attendee) => {
        return {
          ...attendee,
          checkIn: attendee.checkIn !== null,
          checkedInAtt: attendee.checkIn?.createdAt!
        }
      })
      return {
        status: 200,
        success: true,
        data: {
          data: attendeesMaped,
          meta: {
            count: count,
            prevPage,
            currentPage,
            nextPage,
            page,
            limit
          }
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

  _PaginationTratative(page, limit) {
    let tratativePage
    let tratativeLimit
    return [tratativePage, tratativeLimit]
  }

  async getBadgeById(attendeeId: number): Promise<{
    status: number,
    success: boolean,
    data: responseBadgeDTO | string
  }> {
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
      const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, process.env.API_BASE_URL)
      delete badge.event
      return {
        status: 200,
        success: true,
        data: { data: { ...badge, checkInUrl: checkInUrl.toString() }, meta },
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
