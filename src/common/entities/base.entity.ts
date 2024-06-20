import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BaseEntity extends Document {
    @Prop({ default: false })
    soft_deleted: boolean;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;

}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
