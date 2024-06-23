import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Put } from '@nestjs/common'
import { QuizesService } from './quizes.service'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { SubmitQuizDto } from './dto/submit-quize.dto'
import { UsersService } from '../users/users.service'

@ApiTags('Quizes')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
@Controller('quizes')
export class QuizesController {
    constructor(
        private readonly quizesService: QuizesService,
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createQuizeDto: CreateQuizeDto, @Req() req: any) {
        const createQuizeDtoWithUserId = { ...createQuizeDto, user_id: req.user?._id }
        return this.quizesService.create(createQuizeDtoWithUserId)
    }

    @Get()
    findAll(@Req() req: any) {
        return this.quizesService.findAll(req.user?._id)
    }

    @Get(':_id')
    findOne(@Param('_id') _id: string) {
        return this.quizesService.findOne(_id)
    }

    @Patch('/:quiz_id/subject/:subject_id')
    quizStartBySubjectId(@Param('quiz_id') quiz_id: string, @Param('subject_id') subject_id: string, @Req() req: any) {
        return this.quizesService.quizStartBySubjectId(quiz_id, subject_id, req.user?._id)
    }

    @Put(':_id/subject/:subject_id')
    submitQuizBySubjectId(
        @Param('_id') _id: string,
        @Param('subject_id') subject_id: string,
        @Body() submitQuizDto: SubmitQuizDto,
        @Req() req: any
    ) {
        return this.quizesService.submitQuizBySubjectId(_id, subject_id, submitQuizDto, req.user?._id)
    }

    @Patch('score/:quiz_id')
    async score(@Param('quiz_id') quiz_id: string, @Req() req: any) {
        const score = await this.quizesService.score(quiz_id, req.user?._id)
        await this.usersService.userUpdateById(req.user?._id, {
            positive_score: score.total_positive_score,
            negetive_score: score.total_negative_score
        })
        return score
    }
}
