import { AuthService } from './auth.service';
import { Body, Controller, Post, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInUserDto: SignInUserDto) {
      try {
        return this.authService.signIn(signInUserDto);
      } catch (error) {  throw new InternalServerErrorException(error)  }
    }
}
