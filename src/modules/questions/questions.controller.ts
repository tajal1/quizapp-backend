import { Controller, Get, Post, Body, UseGuards, Req, InternalServerErrorException } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'

@ApiTags('Questions')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: any) {
        const createQuestionDtoWithUserId = { ...createQuestionDto, user_id: req.user?._id }
        try {
            return this.questionsService.create(createQuestionDtoWithUserId)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Get()
    findAll() {
        try {
            return this.questionsService.findAll()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
