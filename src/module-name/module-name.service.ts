import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserInterface } from '../@core/domain/module-name/module-name.repository';
import { DTOOutputService } from '../@core/DTO/response.service';
import { UserEntity } from '../@core/domain/module-name/module-name.entity';
import { RedisClient } from 'src/@core/infra/Redis/RedisClient';

const logger = new Logger('Module Name');

@Injectable()
export class ModuleService {
  constructor() { }

  async example(): Promise<DTOOutputService> {
    try {
      return {
        status: 200,
        message: 'success',
      }
    } catch (err) {
      return {
        status: 400,
        message: 'fail',
      }
    }

  }

}
