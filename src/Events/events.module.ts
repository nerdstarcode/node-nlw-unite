import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { EventCreateUseCase } from 'src/@core/useCase/Events/events-create.use-case';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
import { EventSchema, SchemaModule } from 'src/@core/DTO/Events/events.dto';
import { ZodSchema } from 'zod';
import { EventCreateInterceptor } from './Interceptors/create-event-validate.interceptor';
import { EventListOneInterceptor } from './Interceptors/list-event-validate.interceptor';
import { EventListUseCase } from 'src/@core/useCase/Events/events-list.use-case';

@Module({
  imports: [SchemaModule],
  providers: [
    EventCreateInterceptor,
    EventListOneInterceptor,
    EventService,
    {
      provide: EventCreateUseCase,
      useFactory: () => {
        return new EventCreateUseCase(new EventPrismaRepository)
      }
    },
    {
      provide: EventListUseCase,
      useFactory: () => {
        return new EventListUseCase(new EventPrismaRepository)
      }
    },
  ],
  exports: [EventService],
  controllers: [EventsController],
})
export class EventsModule { }
