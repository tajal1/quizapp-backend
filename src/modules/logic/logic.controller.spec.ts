import { Test, TestingModule } from '@nestjs/testing';
import { LogicController } from './logic.controller';
import { LogicService } from './logic.service';

describe('LogicController', () => {
  let controller: LogicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogicController],
      providers: [LogicService],
    }).compile();

    controller = module.get<LogicController>(LogicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
