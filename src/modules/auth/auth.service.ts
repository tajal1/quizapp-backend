import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { SignInUserDto } from './dto/signin-user.dto'
import { UsersService } from 'src/modules/users/users.service'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(signInUserDto: SignInUserDto): Promise<any> {
        const user = await this.usersService.findOneByEmail(signInUserDto.email)
        await this.comparePasswords(signInUserDto.password, user?.password)
        return {
            accessToken: await this.jwtService.signAsync(
                { _id: user._id, username: user.username, email: user.email },
                { secret: process.env.SECRET_JWT_KEY }
            )
        }
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatchPassword = await bcrypt.compare(plainPassword, hashedPassword)
            if (!isMatchPassword)
                throw new UnauthorizedException('Password did not match', {
                    cause: new Error(),
                    description: 'Wrong password'
                })
            return isMatchPassword
        } catch (error) {
            throw new BadRequestException(error.response)
        }
    }
}
