import { Test, TestingModule } from '@nestjs/testing';
import { LogicService } from './logic.service';

describe('LogicService', () => {
  let service: LogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogicService],
    }).compile();

    service = module.get<LogicService>(LogicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
