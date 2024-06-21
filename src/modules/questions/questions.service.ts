import { Injectable } from '@nestjs/common'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Question } from './entities/question.entity'
import { Model } from 'mongoose'
import { CreateQuizeDto } from '../quizes/dto/create-quize.dto'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

@Injectable()
export class QuestionsService {
    constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

    async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
        const createdQuestion = new this.questionModel(createQuestionDto)
        return createdQuestion.save()
    }

    findAll() {
        return `This action returns all questions`
    }

    findOne(id: number) {
        return `This action returns a #${id} question`
    }

    update(id: number, updateQuestionDto: UpdateQuestionDto) {
        return `This action updates a #${id} question`
    }

    remove(id: number) {
        return `This action removes a #${id} question`
    }

    async findQuestionsBasedOnSubjectCodeAndNumber(createQuizeDto: CreateQuizeDto): Promise<Question[]> {
        const fact = {}
        createQuizeDto.quiz_number_per_subject.forEach(question => {
            fact[question.subject_code] = [
                {
                    $match: {
                        subject_code: question.subject_code
                    }
                },
                {
                    $sample: {
                        size: question.quiz_number
                    }
                }
            ]
        })
        const pipeline = [
            {
                $facet: fact
            }
        ]
        const quies = await this.questionModel.aggregate(pipeline)
        const quiz_details = []
        quies.forEach((subject: Question) => {
            for (const key in subject) {
                quiz_details.push({
                    subject_name: subject[key][0].subject_name,
                    subject_code: subject[key][0].subject_code,
                    quizes: subject[key],
                    subject_quiz_total_positive_score: 0,
                    subject_quiz_total_negative_score: 0
                })
            }
        })
        return quiz_details
    }
}
