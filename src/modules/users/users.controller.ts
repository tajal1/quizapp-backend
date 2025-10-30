import { Controller } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { BaseController } from 'src/common/base/base.controller'
import { User } from './entities/user.entity'
import { registerDto } from 'src/common/dto-registry'
import { LogicService } from '../logic/logic.service'

registerDto('users', CreateUserDto)

@Controller('users')
export class UsersController extends BaseController<User, CreateUserDto, CreateUserDto> {
    constructor(usersService: UsersService, logicService:LogicService) {
        super(usersService, logicService)
    }
}
