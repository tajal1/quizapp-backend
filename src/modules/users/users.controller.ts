import { Controller, Req, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseController } from 'src/common/base/base.controller';
import { User } from './entities/user.entity';
import { ValidateDto } from 'src/common/decorators/validate-dto.decorator';
import { DtoValidationInterceptor } from 'src/common/interceptors/dto-validation.interceptor';
import { registerDto } from 'src/common/dto-registry';

registerDto('users', CreateUserDto);

@Controller('users')
export class UsersController extends BaseController<User, CreateUserDto, CreateUserDto> {
    constructor(usersService: UsersService) {
        super(usersService);
    }
}