import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionsService } from './questions.service'
import { QuestionsController } from './questions.controller'
import { Question, QuestionSchema } from './entities/question.entity'

@Module({
    imports: [MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService]
})
export class QuestionsModule {}
