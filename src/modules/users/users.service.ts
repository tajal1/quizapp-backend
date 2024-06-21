import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UsersService {
    private readonly saltRounds = Number(process.env.SALT_ROUNDS)

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await this.hashPassword(createUserDto.password)
        const createdUser = new this.userModel(createUserDto)
        return createdUser.save()
    }

    findAll() {
        return `This action returns all users`
    }

    findOne(id: number) {
        return `This action returns a #${id} user`
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`
    }

    remove(id: number) {
        return `This action removes a #${id} user`
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.userModel.findOne({ email }).exec()
            if (!user)
                throw new NotFoundException('User not found', {
                    cause: new Error(),
                    description: 'Wrong Email address'
                })
            return user
        } catch (error) {
            throw new BadRequestException(error.response)
        }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds)
    }
}
