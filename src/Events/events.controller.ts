import { Body, Controller, Get, Logger, Param, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './events.service';
import { EventCreateInterceptor } from './Interceptors/create-event-validate.interceptor';
import { EventListOneInterceptor } from './Interceptors/list-event-validate.interceptor';

const logger = new Logger('Events');

@Controller('events')
export class EventsController {
  constructor(private _eventService: EventService) { }
  @UseInterceptors(EventListOneInterceptor)
  @Get('/:eventId')
  async getEventById(@Query() query, @Req() req, @Res() res, @Param() param) {
    logger.debug('Get Event')
    await this._eventService.getEvent(param).then((response) => {
      res.status(response.status).json({ data: response.message.data || response.message, meta: { ...response.message.meta, } })
    }).catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })
  }

  @Get('/:eventId/attendees')
  async getAttendeesByEvent(@Query() query, @Req() req, @Res() res, @Param() param) {
    logger.debug('Get Attendees')
    const params = { ...param, ...query }
    delete params.page
    delete params.limit
    const page = param?.page
    const limit = param?.limit
    await this._eventService.getAttendeesByEvent(params, page, limit).then((response) => {
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
