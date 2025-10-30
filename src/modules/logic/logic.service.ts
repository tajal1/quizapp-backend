import { Injectable } from '@nestjs/common';
import { CreateLogicDto } from './dto/create-logic.dto';
import { UpdateLogicDto } from './dto/update-logic.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LogicService {
  constructor(
    private readonly userService: UsersService
  ){

  }
  create(createLogicDto: CreateLogicDto) {
    return 'This action adds a new logic';
  }

   async findAll() {
    return await this.userService.findAll()
  }

  findOne(id: number) {
    return `This action returns a #${id} logic`;
  }

  update(id: number, updateLogicDto: UpdateLogicDto) {
    return `This action updates a #${id} logic`;
  }

  remove(id: number) {
    return `This action removes a #${id} logic`;
  }
}
