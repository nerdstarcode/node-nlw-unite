import { Body, Controller, Get, Logger, Param, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { AttendeesService } from './attendees.service';
import { AttendeesRegistryInterceptor } from './Interceptors/create-attendee-validate.interceptor';

const logger = new Logger('Attendees Controller');

@Controller('attendees')
export class AttendeesController {
  constructor(private _attendeesService: AttendeesService) { }
  @UseInterceptors(AttendeesRegistryInterceptor)
  @Post('/register/:eventId')
  async registryAttendee(@Body() body, @Req() req, @Res() res, @Param() param) {
    logger.debug('Registry Attendee')
    const receive = {...body, ...param}
    await this._attendeesService.registerAttendee(receive).then((response) => {
      res.status(response.status).json({ data: response.message.data || response.message, meta: { ...response.message.meta, } })
    }).catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })

  }

}
