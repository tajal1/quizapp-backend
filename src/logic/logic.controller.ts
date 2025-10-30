import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogicService } from './logic.service';
import { CreateLogicDto } from './dto/create-logic.dto';
import { UpdateLogicDto } from './dto/update-logic.dto';

@Controller('logic')
export class LogicController {
  constructor(private readonly logicService: LogicService) {}

  @Post()
  create(@Body() createLogicDto: CreateLogicDto) {
    return this.logicService.create(createLogicDto);
  }

  @Get()
  findAll() {
    return this.logicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogicDto: UpdateLogicDto) {
    return this.logicService.update(+id, updateLogicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logicService.remove(+id);
  }
}
