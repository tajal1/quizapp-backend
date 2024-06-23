import { Module } from '@nestjs/common'
import { QuizesService } from './quizes.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { QuizesController } from './quizes.controller'
import { Quize, QuizzesSchema } from './entities/quize.entity'
import { QuestionsModule } from '../questions/questions.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: Quize.name, schema: QuizzesSchema }]), QuestionsModule, UsersModule],
    controllers: [QuizesController],
    providers: [QuizesService]
})
export class QuizesModule {}
