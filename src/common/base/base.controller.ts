import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Document } from 'mongoose'; // Import Document from Mongoose
import { BaseService } from './base.service';
import { validateDto } from './dto.validation';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Controller()
export abstract class BaseController<T extends Document, CreateDto, UpdateDto> {
    constructor(protected readonly service: BaseService<T, CreateDto, UpdateDto>) { }

    @Post()
    async create(@Body() createDto: CreateDto, @Req() req: any) {
        try {
            await validateDto(createDto, CreateUserDto)
            console.log('==============<><>', req.url)
            return this.service.create(createDto);
        } catch (error) {
            return new BadRequestException(error)
        }
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}