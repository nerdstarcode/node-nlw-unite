import { Logger } from '@nestjs/common';
import { Attendee, Event } from '@prisma/client';
import { AttendeeEntity } from 'src/@core/domain/Attendees/attendees.entity';
import { AttendeePrismaRepository } from 'src/@core/infra/prisma/attendee.repository';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
const logger = new Logger('Registry Attendee Use Case');

export class AttendeesRegistryUseCase {
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
      const NewAttendee = AttendeeEntity.create(body)
      const eventExistsPromisse = this._verifyIfExistsEvent(body.eventId)
      const userAlreadyRegistersOnEventPromisse = this._userAlreadyRegistersOnEvent(body.email, body.eventId)

      const eventExists = await eventExistsPromisse
      const userAlreadyRegistersOnEvent = await userAlreadyRegistersOnEventPromisse
      const existsSpaceOnEvent = await this._verifyIfExistsSpaceOnEvent()

      const eventDoestExists = !eventExists
      const userNotRegisterOnEvent = !userAlreadyRegistersOnEvent
      const eventCrowded = !existsSpaceOnEvent
      switch (true) {
        case (eventDoestExists): {
          return {
            status: 400,
            success: false,
            data: `Event with id equal to '${body.eventId}' does not exists`
          }
        }
        case (userAlreadyRegistersOnEvent): {
          return {
            status: 400,
            success: false,
            data: `User already registers on event with id equal to '${body.eventId}'`
          }
        }
        case (eventCrowded): {
          return {
            status: 400,
            success: false,
            data: `Event with id equal to '${body.eventId}' it's full`
          }
        }
        case (eventExists && userNotRegisterOnEvent && existsSpaceOnEvent): {
          return {
            status: 201,
            success: true,
            data: await this._attendeesRepository.create(NewAttendee)
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

  async _verifyIfExistsEvent(id: string) {
    try {
      this.Event = await this._eventRepository.findOne(id)
      if (this.Event) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log('error on verify event')
      return false
    }
  }

  async _userAlreadyRegistersOnEvent(email: string, eventId: string) {
    try {
      if (await this._attendeesRepository.findOneGeneric({
        eventId_email: {
          email,
          eventId
        }
      } as any)) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error(err.message)
      console.log('error on verify event')
      return false
    }
  }

  async _verifyIfExistsSpaceOnEvent() {
    if (this.Event) {
      this.Event.maximumAttendees
      const amountOfAttendees = await this._attendeesRepository.countAmountOfAttendeesForEvent(this.Event.id)
      if (this.Event.maximumAttendees > amountOfAttendees) {
        return true
      } else {
        return false
      }
    }
  }
}
