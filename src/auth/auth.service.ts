import { UsersService } from 'src/users/users.service';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

  async signIn(signInUserDto: SignInUserDto): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(signInUserDto.email);
      await this.comparePasswords(signInUserDto.password, user?.password);
      return { access_token: await this.jwtService.signAsync({ _id: user._id, username: user.username, email: user.email }) };
    } catch (error) {  throw new InternalServerErrorException(error)  }
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatchPassword = await bcrypt.compare(plainPassword, hashedPassword);
      if(!isMatchPassword) throw new UnauthorizedException('Password did not match', { cause: new Error(), description: 'Wrong password' });
      return isMatchPassword;
    } catch (error) { throw new BadRequestException(error.response) }
  }
}
