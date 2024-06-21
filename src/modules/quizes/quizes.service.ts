import { Injectable } from '@nestjs/common'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { UpdateQuizeDto } from './dto/update-quize.dto'
import { QuestionsService } from '../questions/questions.service'
import { InjectModel } from '@nestjs/mongoose'
import { Quize } from './entities/quize.entity'
import { Model } from 'mongoose'

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

    update(id: number, updateQuizeDto: UpdateQuizeDto) {
        return `This action updates a #${id} quize`
    }

    remove(id: number) {
        return `This action removes a #${id} quize`
    }
}
