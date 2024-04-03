import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './Events/events.module';
import { AttendeesModule } from './Attendee/attendees.module';

@Module({
  imports: [
    EventsModule,
    AttendeesModule
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
