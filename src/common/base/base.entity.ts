import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class BaseEntity extends Document {
    @Prop({ default: false })
    soft_deleted: boolean

    @Prop({ default: Date.now })
    created_at: Date

    @Prop({ default: Date.now })
    updated_at: Date

    @Prop({ default: true })
    status: boolean

    @Prop({ type: Types.ObjectId, required: false })
    soft_deleted_by: Types.ObjectId

}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity)
