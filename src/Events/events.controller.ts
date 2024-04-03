import { Body, Controller, Get, Logger, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './events.service';
import { EventCreateInterceptor } from './Interceptors/create-event-validate.interceptor';

const logger = new Logger('Events');

@Controller('events')
export class EventsController {
  constructor(private _eventService: EventService) { }
  @Get('/')
  async getNlpRedisHash(@Query() query, @Req() req, @Res() res) {
    logger.debug('Get Example')
    await this._eventService.example().then((response) => {
      res.status(response.status).json({ data: response.message.data || response.message, meta: { ...response.message.meta, } })
    }).catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })

  }
  @UseInterceptors(EventCreateInterceptor)
  @Post('/')
  async createEvent(@Body() body, @Req() req, @Res() res) {
    logger.debug('Create Event')
    await this._eventService.createEvent(body).then((response) => {
      res.status(response.status).json({ data: response.message.data || response.message, meta: { ...response.message.meta, } })
    }).catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })

  }

}
