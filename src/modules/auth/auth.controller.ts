import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SignInUserDto } from './dto/signin-user.dto'
import { Body, Controller, Post, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common'

@ApiTags('Login')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInUserDto: SignInUserDto) {
        try {
            return this.authService.signIn(signInUserDto)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
