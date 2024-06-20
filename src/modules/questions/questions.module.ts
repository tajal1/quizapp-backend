import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionEntity, QuestionSchema } from './entities/question.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: QuestionEntity.name, schema: QuestionSchema }])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
