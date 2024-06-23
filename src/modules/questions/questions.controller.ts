import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: any) {
        const createQuestionDtoWithUserId = { ...createQuestionDto, user_id: req.user?._id }
        return this.questionsService.create(createQuestionDtoWithUserId)
    }

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Get()
    findAll() {
        return this.questionsService.findAll()
    }
}
