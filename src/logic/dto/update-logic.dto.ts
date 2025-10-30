import { PartialType } from '@nestjs/swagger';
import { CreateLogicDto } from './create-logic.dto';

export class UpdateLogicDto extends PartialType(CreateLogicDto) {}
