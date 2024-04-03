import { Logger } from '@nestjs/common';
import { Event } from '@prisma/client';
import { EventDTO, EventSchema } from 'src/@core/DTO/Events/events.dto';
import { EventEntity } from 'src/@core/domain/Events/event.entity';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
const logger = new Logger('Create Event Use Case');

export class EventCreateUseCase {
  constructor(
    private _eventRepository: EventPrismaRepository
  ) {
  }
  async execute(
    body: Event
  ): Promise<{ status: number, success: boolean, data: any }> {
    try {
      const NewEvent = EventEntity.create(body)
      const existsSlug = await this.validateSlug(NewEvent)
      if (existsSlug) {
        return {
          success: false,
          status: 400,
          data: {
            message: `Already exists slug ${NewEvent.slug}`,
            tip: 'Try new title for event'
          }
        }
      }
      return {
        status: 201,
        success: true,
        data: await this._eventRepository.create(NewEvent)
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

  async validateSlug(event: Event) {
    logger.debug('Validating if Slug Exists')
    return await this._eventRepository.findOneGeneric({ slug: event.slug })
  }
}
