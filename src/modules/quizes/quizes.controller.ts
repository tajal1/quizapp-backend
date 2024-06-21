import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { QuizesService } from './quizes.service'
import { CreateQuizeDto } from './dto/create-quize.dto'
import { UpdateQuizeDto } from './dto/update-quize.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'

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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quizesService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQuizeDto: UpdateQuizeDto) {
        return this.quizesService.update(+id, updateQuizeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quizesService.remove(+id)
    }
}
