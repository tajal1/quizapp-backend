import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { Document } from 'mongoose' // Import Document from Mongoose
import { BaseService } from './base.service'
import { validateDto } from './dto.validation'
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto'
import { getDtoClass } from '../dto-registry'
import { validate } from 'class-validator'
import { LogicService } from 'src/modules/logic/logic.service'

@Controller()
export abstract class BaseController<T extends Document, CreateDto, UpdateDto> {
    constructor(
        protected readonly service: BaseService<T, CreateDto, UpdateDto>,
        protected readonly logicService: LogicService,
    ) {}

    @Post()
    async create(@Body() createDto: CreateDto, @Req() req: any) {
        try {
            // Get DTO class based on URL
            const url = req.url.split('/')
            const dtoClass = getDtoClass(url[url.length - 1]) // Strip query params
            if (dtoClass) {
                await validateDto(createDto, dtoClass)
                console.log('BaseController: Validated DTO:', createDto, 'URL:', req.url)
            } else {
                console.log('BaseController: No specific DTO validation for URL:', req.url)
            }
            return this.service.create(createDto)
        } catch (error) {
            return new BadRequestException(error)
        }
    }

    @Get()
    async findAll() {
        const data = await this.logicService.findAll()
        if(data){
            console.log('========Custom logic')
            return data
        }
        console.log('data', data)
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
