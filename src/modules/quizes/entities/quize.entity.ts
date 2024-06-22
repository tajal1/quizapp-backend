import { Schema as MongooseSchema } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Question } from 'src/modules/questions/entities/question.entity'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

@Schema()
export class QuizQuestion extends Question {
    @Prop()
    user_answer: string

    @Prop({ enum: QUIZ_CONSTANT.USER_SUBMIT_STATUS.STATUS_ENUM, default: QUIZ_CONSTANT.USER_SUBMIT_STATUS.NOT_SUBMIT.CODE })
    user_submit_status: string
}
const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion)

@Schema()
export class QuizDetails extends BaseEntity {
    @Prop({ required: true })
    subject_name: string

    @Prop({ required: true })
    subject_code: string

    @Prop({ type: [QuizQuestionSchema] })
    quizes: QuizQuestion[]

    @Prop({ default: 0 })
    subject_quiz_total_positive_score: number

    @Prop({ default: 0 })
    subject_quiz_total_negative_score: number

    @Prop()
    subject_quiz_start_at: Date

    @Prop()
    subject_quiz_expired_at: Date

    @Prop()
    subject_quiz_end_at: Date

    @Prop({
        enum: QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.STATUS_ENUM,
        default: QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.DEFAULT.CODE
    })
    subject_quiz_submit_status: string
}

const QuizDetailsSchema = SchemaFactory.createForClass(QuizDetails)

@Schema()
export class Quize extends BaseEntity {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user_id: MongooseSchema.Types.ObjectId

    @Prop({ type: [QuizDetailsSchema] })
    quiz_details: QuizDetails[]

    @Prop({ default: 0 })
    total_positive_score: number

    @Prop({ default: 0 })
    total_negative_score: number

    @Prop({
        enum: QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.STATUS_ENUM,
        default: QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.DEFAULT.CODE
    })
    submit_status: string

    @Prop({ default: 0 })
    score: number

    @Prop({ default: Date.now })
    quiz_start_at: Date

    @Prop()
    quiz_expired_at: Date

    @Prop()
    quiz_end_at: Date
}

export const QuizzesSchema = SchemaFactory.createForClass(Quize)
