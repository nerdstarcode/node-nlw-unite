import { Test, TestingModule } from '@nestjs/testing';
import { ModuleNameController } from './module-name.controller';

describe('ModuleNameController', () => {
  let controller: ModuleNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleNameController],
    }).compile();

    controller = module.get<ModuleNameController>(ModuleNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
