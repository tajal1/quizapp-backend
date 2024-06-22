import { Schema as MongooseSchema } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

@Schema()
export class Question extends BaseEntity {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user_id: MongooseSchema.Types.ObjectId

    @Prop({ required: true })
    question: string

    @Prop({ required: true })
    a: string

    @Prop({ required: true })
    b: string

    @Prop({ required: true })
    c: string

    @Prop({ required: true })
    d: string

    @Prop({ enum: QUIZ_CONSTANT.SUBJECT_CODE.CODE_ENUM, required: true })
    subject_code: string

    @Prop({ enum: QUIZ_CONSTANT.SUBJECT_CODE.NAME_ENUM, required: true })
    subject_name: string

    @Prop({ required: true })
    answer: string

    @Prop({ required: true, default: 1 })
    positive_score: number

    @Prop({ required: true, default: 0.25 })
    negetive_score: number

    @Prop({ required: true, default: true })
    is_approved: boolean
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
