import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ErrorLogDocument = ErrorLog & Document;

@Schema()
export class ErrorLog {
  @Prop()
  error: string;

  @Prop({
    default: Date.now(),
  })
  date: Date;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
