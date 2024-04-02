import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events.create-use-case';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';

@Module({
  providers: [EventService, {
    provide: EventCreateUseCase,
    useFactory: () => {
      return new EventCreateUseCase(new EventPrismaRepository)
    }
  }],
  imports: [],
  exports: [EventService],
  controllers: [EventsController],
})
export class EventsModule { }
