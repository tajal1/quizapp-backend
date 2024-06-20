import { BaseEntity } from 'src/common/entities/base.entity'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class UserEntity extends BaseEntity {
    @Prop({ required: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ default: 0 })
    total_score: number
}

export const UserSchema = SchemaFactory.createForClass(UserEntity)
