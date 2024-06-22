import { Injectable } from '@nestjs/common'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { UpdateQuizeDto } from './dto/update-quize.dto'
import { QuestionsService } from '../questions/questions.service'
import { InjectModel } from '@nestjs/mongoose'
import { QuizDetails, QuizQuestion, Quize } from './entities/quize.entity'
import mongoose, { Model, ObjectId } from 'mongoose'
import { SubmitQuizDto } from './dto/submit-quize.dto'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

@Injectable()
export class QuizesService {
    constructor(
        @InjectModel(Quize.name) private quizModel: Model<Quize>,
        private readonly questionsService: QuestionsService
    ) { }

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

    async quizStartBySubjectId(quiz_id: string, subject_id: string, user_id: ObjectId) {
        const id = { 'quiz_details._id': new mongoose.Types.ObjectId(subject_id) }
        const { total_quiz, quiz_details } = await this.quizCountBySubjectId(quiz_id, subject_id)
        const updateData = {
            'quiz_details.$.subject_quiz_start_at': new Date(),
            'quiz_details.$.subject_quiz_expired_at': new Date(new Date().getTime() + total_quiz * 60000)
        }
        await this.updateQuizDetailsById(id, updateData)
        return quiz_details
    }

    async quizCountBySubjectId(quiz_id: string, subject_id: string): Promise<QuizQuestion | any> {
        const quizDetailsObjectId = new mongoose.Types.ObjectId(subject_id)
        const quizId = new mongoose.Types.ObjectId(quiz_id)
        const quizCount = await this.quizModel.aggregate([
            {
                '$match': {
                    '_id': quizId
                }
            },
            {
                $unwind: {
                    path: '$quiz_details'
                }
            },
            {
                $match: {
                    'quiz_details._id': quizDetailsObjectId
                }
            },
            {
                $project: {
                    _id: 1,
                    quiz_details: 1,
                    total_quiz_count: {
                        $size: '$quiz_details.quizes'
                    }
                }
            }
        ])

        return {
            total_quiz: quizCount.length ? quizCount[0].total_quiz_count : 0,
            quiz_details: quizCount.length ? quizCount[0].quiz_details : null
        }
    }

    async updateQuizDetailsById(id: object, updateData: object): Promise<Quize | null> {
        console.log(id)
        await this.quizModel.updateOne(id, { $set: { ...JSON.parse(JSON.stringify(updateData)) } }, { new: true }).exec()
        return
    }

    remove(id: number) {
        return `This action removes a #${id} quize`
    }

    async submitQuizBySubjectId(_id: string, subject_id: string, submitQuizDto: SubmitQuizDto, user_id: ObjectId) {

        const id = { 'quiz_details._id': new mongoose.Types.ObjectId(subject_id) }
        const _ids = new mongoose.Types.ObjectId(_id)
        const { total_quiz, quiz_details } = JSON.parse(JSON.stringify(await this.quizCountBySubjectId(_id, subject_id)))


        for (let index = 0; index < submitQuizDto.quizes.length; index++) {
            for (let i = 0; i < quiz_details.quizes.length; i++) {

                if (quiz_details.quizes[i]._id === submitQuizDto.quizes[index]._id) {
                    quiz_details.quizes[i].user_answer = submitQuizDto.quizes[index].user_answer

                    if (quiz_details.quizes[i].user_answer === quiz_details.quizes[i].answer) {
                        quiz_details.quizes[i].user_submit_status = QUIZ_CONSTANT.USER_SUBMIT_STATUS.RIGHT.CODE
                        quiz_details.subject_quiz_total_positive_score += 1
                    } else {
                        quiz_details.quizes[i].user_submit_status = QUIZ_CONSTANT.USER_SUBMIT_STATUS.WRONG.CODE
                        quiz_details.subject_quiz_total_negative_score += .25
                    }
                }
            }
        }

        const res = await this.updateQuizDetails(_id, subject_id, submitQuizDto.quizes);

        await this.quizModel.findByIdAndUpdate(
            {_id: _ids},
            { $inc: { 
                total_positive_score: quiz_details.subject_quiz_total_positive_score ,
                total_negative_score: quiz_details.subject_quiz_total_negative_score
            } },
            { new: true }
          ).exec();
        return res
    }

    
    async updateQuizDetails(quizId: string, quizDetailsId: string, updates: { _id: string, user_answer: string }[]) {
        const bulkOps = updates.map(update => ({
          updateOne: {
            filter: {
              _id: quizId,
              'quiz_details._id': new mongoose.Types.ObjectId(quizDetailsId) ,
              'quiz_details.quizes._id':new mongoose.Types.ObjectId(update._id) ,
            },
            update: {
              $set: {
                'quiz_details.$[i].quizes.$[j].user_answer': update.user_answer,
              },
            },
            arrayFilters: [
              { 'i._id': new mongoose.Types.ObjectId(quizDetailsId) },
              { 'j._id': new mongoose.Types.ObjectId(update._id) },
            ],
          }
        }));
      
        return await this.quizModel.bulkWrite(bulkOps);
      }


}
