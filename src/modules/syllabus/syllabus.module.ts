import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';

@Module({
  controllers: [SyllabusController],
  providers: [SyllabusService],
})
export class SyllabusModule {}
