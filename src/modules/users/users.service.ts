import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class UsersService extends BaseService<User, CreateUserDto, CreateUserDto> {
    constructor(@InjectModel(User.name) userModel: Model<User>) {
        super(userModel);
    }
}