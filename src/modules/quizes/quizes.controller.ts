import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Req,
    Put,
    InternalServerErrorException
} from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { QuizesService } from './quizes.service'
import { UsersService } from '../users/users.service'
import { SubmitQuizDto } from './dto/submit-quize.dto'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

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
        try {
            return this.quizesService.create(createQuizeDtoWithUserId)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Get()
    findAll(@Req() req: any) {
        try {
            return this.quizesService.findAll(req.user?._id)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Get(':_id')
    findOne(@Param('_id') _id: string) {
        try {
            return this.quizesService.findOne(_id)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Patch('/:quiz_id/subject/:subject_id')
    quizStartBySubjectId(@Param('quiz_id') quiz_id: string, @Param('subject_id') subject_id: string, @Req() req: any) {
        try {
            return this.quizesService.quizStartBySubjectId(quiz_id, subject_id, req.user?._id)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Put(':_id/subject/:subject_id')
    submitQuizBySubjectId(
        @Param('_id') _id: string,
        @Param('subject_id') subject_id: string,
        @Body() submitQuizDto: SubmitQuizDto,
        @Req() req: any
    ) {
        try {
            return this.quizesService.submitQuizBySubjectId(_id, subject_id, submitQuizDto, req.user?._id)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Patch('score/:quiz_id')
    async score(@Param('quiz_id') quiz_id: string, @Req() req: any) {
        try {
            const score = await this.quizesService.score(quiz_id, req.user?._id)
            await this.usersService.incrementScoreById(req.user?._id, {
                positive_score: score.total_positive_score,
                negetive_score: score.total_negative_score
            })
            return score
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
