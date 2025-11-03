import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, Document } from 'mongoose'

@Injectable()
export abstract class BaseService<T extends Document, CreateDto = any, UpdateDto = any> {
    constructor(protected readonly model: Model<T>) {}

    // @CallHook()
    async create(createDto: CreateDto): Promise<T> {
        console.log('=============')
        const createdEntity = new this.model(createDto)
        return createdEntity.save()
    }

    async findAll(): Promise<T[]> {
        console.log('From base service')
        return this.model.find().exec()
    }

    async findOne(id: string): Promise<T> {
        const entity = await this.model.findById(id).exec()
        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`)
        }
        return entity
    }

    async update(id: string, updateDto: UpdateDto): Promise<T> {
        const entity = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec()
        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`)
        }
        return entity
    }

    async remove(id: string): Promise<void> {
        const result = await this.model.deleteOne({ _id: id }).exec()
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Entity with ID ${id} not found`)
        }
    }
}
