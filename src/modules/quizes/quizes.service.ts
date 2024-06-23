import { Injectable } from '@nestjs/common'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { QuestionsService } from '../questions/questions.service'
import { InjectModel } from '@nestjs/mongoose'
import { QuizQuestion, Quize } from './entities/quize.entity'
import mongoose, { Model, ObjectId } from 'mongoose'
import { SubmitQuizDto } from './dto/submit-quize.dto'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

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

    findAll(user_id: string) {
        return this.quizModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    }

    findOne(_id: string) {
        return this.quizModel.findById(_id)
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
                $match: {
                    _id: quizId
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
        await this.quizModel
            .updateOne(id, { $set: { ...JSON.parse(JSON.stringify(updateData)) } }, { new: true })
            .exec()
        return
    }

    async submitQuizBySubjectId(_id: string, subject_id: string, submitQuizDto: SubmitQuizDto, user_id: ObjectId) {
        const id = { 'quiz_details._id': new mongoose.Types.ObjectId(subject_id) }
        const _ids = new mongoose.Types.ObjectId(_id)
        const { total_quiz, quiz_details } = JSON.parse(
            JSON.stringify(await this.quizCountBySubjectId(_id, subject_id))
        )

        const res = await this.updateQuizDetails(_id, subject_id, submitQuizDto.quizes)

        await this.quizModel
            .findByIdAndUpdate(
                { _id: _ids },
                {
                    $inc: {
                        total_positive_score: quiz_details.subject_quiz_total_positive_score,
                        total_negative_score: quiz_details.subject_quiz_total_negative_score
                    }
                },
                { new: true }
            )
            .exec()
        return res
    }

    async updateQuizDetails(quizId: string, quizDetailsId: string, updates: { _id: string; user_answer: string }[]) {
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: {
                    _id: quizId,
                    'quiz_details._id': new mongoose.Types.ObjectId(quizDetailsId),
                    'quiz_details.quizes._id': new mongoose.Types.ObjectId(update._id)
                },
                update: {
                    $set: {
                        'quiz_details.$[i].quizes.$[j].user_answer': update.user_answer,
                        'quiz_details.$[i].quizes.$[j].user_submit_status': QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.SUBMIT.CODE
                    }
                },
                arrayFilters: [
                    { 'i._id': new mongoose.Types.ObjectId(quizDetailsId) },
                    { 'j._id': new mongoose.Types.ObjectId(update._id) }
                ]
            }
        }))

        return await this.quizModel.bulkWrite(bulkOps)
    }

    async score(_id: string, user_id: string) {
        const score: any = await this.quizModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(_id),
                    user_id: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $unwind: {
                    path: '$quiz_details'
                }
            },
            {
                $unwind: {
                    path: '$quiz_details.quizes'
                }
            },
            {
                $addFields: {
                    score: {
                        $cond: {
                            if: {
                                $and: [
                                    {
                                        $eq: ['$quiz_details.quizes.user_answer', '$quiz_details.quizes.answer']
                                    },
                                    {
                                        $eq: ['$quiz_details.quizes.user_submit_status', 'submit']
                                    }
                                ]
                            },
                            then: '$quiz_details.quizes.positive_score',
                            else: '$quiz_details.quizes.negetive_score'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    total_positive_score: {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$quiz_details.quizes.user_answer', '$quiz_details.quizes.answer']
                                        },
                                        {
                                            $eq: ['$quiz_details.quizes.user_submit_status', 'submit']
                                        }
                                    ]
                                },
                                then: '$quiz_details.quizes.positive_score',
                                else: 0
                            }
                        }
                    },
                    total_negative_score: {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $ne: ['$quiz_details.quizes.user_answer', '$quiz_details.quizes.answer']
                                        },
                                        {
                                            $eq: ['$quiz_details.quizes.user_submit_status', 'submit']
                                        }
                                    ]
                                },
                                then: '$quiz_details.quizes.negetive_score',
                                else: 0
                            }
                        }
                    }
                }
            }
        ])

        await this.updateQuizDetailsById(
            { _id: new mongoose.Types.ObjectId(_id) },
            {
                submit_status: QUIZ_CONSTANT.QUIZ_SUBMIT_STATUS.SUBMIT.CODE,
                total_positive_score: score[0]?.total_positive_score ? score[0].total_positive_score : 0,
                total_negative_score: score[0]?.total_negative_score ? score[0].total_negative_score : 0
            }
        )

        return score.length ? score[0] : { _id: null, total_positive_score: 0, total_negative_score: 0 }
    }
}
