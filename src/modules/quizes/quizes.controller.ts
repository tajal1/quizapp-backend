import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common'
import { QuizesService } from './quizes.service'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { UpdateQuizeDto } from './dto/update-quize.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { SubmitQuizDto } from './dto/submit-quize.dto'

@ApiTags('Quizes')
@Controller('quizes')
export class QuizesController {
    constructor(private readonly quizesService: QuizesService) {}

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createQuizeDto: CreateQuizeDto, @Req() req: any) {
        const createQuizeDtoWithUserId = { ...createQuizeDto, user_id: req.user?._id }
        return this.quizesService.create(createQuizeDtoWithUserId)
    }

    @Get()
    findAll() {
        return this.quizesService.findAll()
    }

    @Get(':_id')
    findOne(@Param('_id') _id: string) {
        return this.quizesService.findOne(_id)
    }

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Patch('/:quiz_id/subject/:subject_id')
    quizStartBySubjectId(@Param('quiz_id') quiz_id: string, @Param('subject_id') subject_id: string, @Req() req: any) {
        return this.quizesService.quizStartBySubjectId(quiz_id, subject_id, req.user?._id)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quizesService.remove(+id)
    }

    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @Put(':_id/subject/:subject_id')
    submitQuizBySubjectId(@Param('_id') _id: string, @Param('subject_id') subject_id: string, @Body() submitQuizDto: SubmitQuizDto, @Req() req: any) {
        return this.quizesService.submitQuizBySubjectId(_id, subject_id,submitQuizDto, req.user?._id)
    }
}
