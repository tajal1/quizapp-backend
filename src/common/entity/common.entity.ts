import { Date } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class CommonEntity {
  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  updated_at: string;
}
