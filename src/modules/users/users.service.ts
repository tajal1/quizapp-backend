import mongoose, { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UsersService {
    private readonly saltRounds = Number(process.env.SALT_ROUNDS)

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await this.hashPassword(createUserDto.password)
        const createdUser = new this.userModel(createUserDto)
        return createdUser.save()
    }

    findAll() {
        return `This action returns all users`
    }

    async findOne(_id: string) {
        return await this.userModel.findById({ _id });
    }

    async findOneWthRank(_id: string) {
        return await this.userModel.aggregate([
            {
                '$addFields': {
                    'score': {
                        '$subtract': [
                            '$positive_score', '$negetive_score'
                        ]
                    }
                }
            }, {
                '$sort': {
                    'score': -1
                }
            }, {
                '$group': {
                    '_id': null,
                    'users': {
                        '$push': {
                            '_id': '$_id',
                            'username': '$username',
                            'email': '$email',
                            'positive_score': '$positive_score',
                            'negetive_score': '$negetive_score',
                            'score': '$score'
                        }
                    }
                }
            }, {
                '$unwind': {
                    'path': '$users',
                    'includeArrayIndex': 'rank'
                }
            }, {
                '$project': {
                    '_id': '$users._id',
                    'username': '$users.username',
                    'email': '$users.email',
                    'positive_score':'$users.positive_score',
                    'negetive_score': '$users.negetive_score',
                    'score': '$users.score',
                    'rank': {
                        '$add': [
                            '$rank', 1
                        ]
                    }
                }
            }, {
                '$match': {
                    '_id': new mongoose.Types.ObjectId(_id)
                }
            }
        ]);
    }

    async userUpdateById(id: string, updateData: object): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(id, { $set: { ...JSON.parse(JSON.stringify(updateData)) } }).exec()
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
