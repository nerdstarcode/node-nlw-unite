import { Module } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';
import { SchemaModule } from 'src/@core/DTO/Events/events.dto';
import { AttendeesRegistryInterceptor } from './Interceptors/create-attendee-validate.interceptor';
import { AttendeesRegistryUseCase } from 'src/@core/useCase/Attendees/attendees-registry.use-case';
import { AttendeePrismaRepository } from 'src/@core/infra/prisma/attendee.repository';
import { EventPrismaRepository } from 'src/@core/infra/prisma/event.repository';
import { AttendeeBadgeInterceptor } from './Interceptors/get-attendee-badge.interceptor';
import { AttendeesListUseCase } from 'src/@core/useCase/Attendees/attendees-list.use-case';
import { CheckInUseCase } from 'src/@core/useCase/Attendees/attendees-check-in.use-case';
import { CheckInPrismaRepository } from 'src/@core/infra/prisma/check-in.repository';

@Module({
  imports: [SchemaModule],
  providers: [
    AttendeesRegistryInterceptor,
    AttendeesService,
    AttendeeBadgeInterceptor,
    {
      provide: AttendeesRegistryUseCase,
      useFactory: () => {
        return new AttendeesRegistryUseCase(new AttendeePrismaRepository, new EventPrismaRepository)
      }
    },
    {
      provide: AttendeesListUseCase,
      useFactory: () => {
        return new AttendeesListUseCase(new AttendeePrismaRepository, new EventPrismaRepository)
      }
    },
    {
      provide: CheckInUseCase,
      useFactory: () => {
        return new CheckInUseCase(new AttendeePrismaRepository, new CheckInPrismaRepository, new EventPrismaRepository)
      }
    },
  ],
  exports: [AttendeesService],
  controllers: [AttendeesController],
})
export class AttendeesModule { }
