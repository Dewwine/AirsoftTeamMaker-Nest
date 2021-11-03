import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop()
  method: string;

  @Prop()
  request: string;

  @Prop({
    default: Date.now(),
  })
  date: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
