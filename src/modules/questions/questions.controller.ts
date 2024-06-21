import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
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

    @Get()
    findAll() {
        return this.questionsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionsService.update(+id, updateQuestionDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.questionsService.remove(+id)
    }
}
