import { Module } from '@nestjs/common'
import { QuizesService } from './quizes.service'
import { QuizesController } from './quizes.controller'
import { QuestionsModule } from '../questions/questions.module'
import { MongooseModule } from '@nestjs/mongoose'
import { Quize, QuizzesSchema } from './entities/quize.entity'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: Quize.name, schema: QuizzesSchema }]), QuestionsModule, UsersModule],
    controllers: [QuizesController],
    providers: [QuizesService]
})
export class QuizesModule {}
