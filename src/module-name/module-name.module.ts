import { Module } from '@nestjs/common';
import { ModuleService } from './module-name.service';
import { ModuleNameController } from './module-name.controller';
import { UserRepository } from '../@core/infra/prisma/module-name.repository';

@Module({
  providers: [ModuleService, UserRepository],
  imports: [UserRepository],
  exports: [ModuleService],
  controllers: [ModuleNameController],
})
export class ModuleNameModule { }
