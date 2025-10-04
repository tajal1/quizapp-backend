import { PartialType } from '@nestjs/mapped-types';
import { CreateSyllabusDto } from './create-syllabus.dto';

export class UpdateSyllabusDto extends PartialType(CreateSyllabusDto) {}
