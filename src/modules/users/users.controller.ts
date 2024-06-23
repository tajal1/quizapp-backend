import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { AuthGuard } from '../auth/auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Body, UseGuards, Req, InternalServerErrorException } from '@nestjs/common'
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            return this.usersService.create(createUserDto)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Get('me')
    async findOne(@Req() req: any) {
        try {
            const user_id: string = req.user._id
            const user = await this.usersService.findOneWthRank(user_id)
            return user[0]
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
