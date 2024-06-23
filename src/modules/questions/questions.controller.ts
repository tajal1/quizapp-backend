import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
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
        return this.questionsService.create(createQuestionDtoWithUserId)
    }

    @Get()
    findAll() {
        return this.questionsService.findAll()
    }
}
