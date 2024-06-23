import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: 'jwtConstants.secret',
            signOptions: { expiresIn: '600000000s' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
