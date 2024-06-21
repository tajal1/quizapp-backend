import { Injectable } from '@nestjs/common'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { UpdateQuizeDto } from './dto/update-quize.dto'
import { QuestionsService } from '../questions/questions.service'
import { InjectModel } from '@nestjs/mongoose'
import { QuizDetails, QuizQuestion, Quize } from './entities/quize.entity'
import mongoose, { Model, ObjectId } from 'mongoose'

@Injectable()
export class QuizesService {
    constructor(
        @InjectModel(Quize.name) private quizModel: Model<Quize>,
        private readonly questionsService: QuestionsService
    ) {}

    async create(createQuizeDto: CreateQuizeDto | any) {
        const quizes = await this.questionsService.findQuestionsBasedOnSubjectCodeAndNumber(createQuizeDto)

        const createdQuize = new this.quizModel({
            user_id: createQuizeDto?.user_id,
            quiz_details: quizes,
            total_positive_score: 0,
            total_negative_score: 0,
            score: 0
        })
        return createdQuize.save()
    }

    findAll() {
        return `This action returns all quizes`
    }

    findOne(id: number) {
        return `This action returns a #${id} quize`
    }

    async quizStartBySubjectId(subject_id: string, user_id: ObjectId) {
        const id = { 'quiz_details._id': new mongoose.Types.ObjectId(subject_id) }
        const {total_quiz, quiz_details} = await this.quizCountBySubjectId(subject_id);
        const updateData = {
            'quiz_details.$.subject_quiz_start_at': new Date(),
            'quiz_details.$.subject_quiz_expired_at': new Date(new Date().getTime() + total_quiz * 60000)
        }
        await this.updateQuizDetailsById(id, updateData);
        return quiz_details
    }

    async quizCountBySubjectId(subject_id: string): Promise<QuizQuestion | any>{
        const quizDetailsObjectId = new mongoose.Types.ObjectId(subject_id)
        const quizCount =  await this.quizModel.aggregate([
            {
              '$unwind': {
                'path': '$quiz_details'
              }
            }, {
              '$match': {
                'quiz_details._id': quizDetailsObjectId
              }
            }, {
              '$project': {
                '_id': 1, 
                'quiz_details': 1,
                'total_quiz_count': {
                  '$size': '$quiz_details.quizes'
                }
              }
            }
          ])

          return {
            total_quiz: quizCount.length ? quizCount[0].total_quiz_count : 0,
            quiz_details: quizCount.length ? quizCount[0].quiz_details : null,
          }
    }

    async updateQuizDetailsById(id: object, updateData: object): Promise<Quize | null> {

         await this.quizModel.updateOne(
          id,
          { $set: { ...updateData } },
          { new: true }
        ).exec();
        return
      }

    remove(id: number) {
        return `This action removes a #${id} quize`
    }
}
