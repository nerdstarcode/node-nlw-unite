import { Body, Controller, Get, Logger, Post, Query, Req, Res } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { ModuleService } from './module-name.service';

const logger = new Logger('Module Name');

@Controller('module')
export class ModuleNameController {
  constructor(private _moduleNameService: ModuleService) { }
  @Get('/')
  async getNlpRedisHash(@Query() query, @Req() req, @Res() res) {
    logger.debug('Get Example')
    await this._moduleNameService.example().then((response) => {
      res.status(response.status).json({ data: response.message.data || response.message, meta: { ...response.message.meta, } })
    }).catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    })

  }

}
