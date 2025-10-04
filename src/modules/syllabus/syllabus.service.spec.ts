import { Test, TestingModule } from '@nestjs/testing';
import { SyllabusService } from './syllabus.service';

describe('SyllabusService', () => {
  let service: SyllabusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyllabusService],
    }).compile();

    service = module.get<SyllabusService>(SyllabusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
