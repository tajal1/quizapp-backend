import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { AuthGuard } from '../auth/auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto)
    }

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Get('me')
    async findOne(@Req() req: any) {
        const user_id: string = req.user._id;
        const user = await this.usersService.findOneWthRank(user_id);
        return user[0]

    }
}
