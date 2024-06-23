import { BaseEntity } from 'src/common/entities/base.entity'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class User extends BaseEntity {
    @Prop({ required: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ default: 0 })
    positive_score: number

    @Prop({ default: 0 })
    negetive_score: number
}

export const UserSchema = SchemaFactory.createForClass(User)
