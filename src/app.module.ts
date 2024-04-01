import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModuleNameController } from './module-name/module-name.controller';
import { ModuleNameModule } from './module-name/module-name.module';

@Module({
  imports: [ModuleNameModule],
  controllers: [AppController, ModuleNameController],
  providers: [AppService,],
})
export class AppModule {}
