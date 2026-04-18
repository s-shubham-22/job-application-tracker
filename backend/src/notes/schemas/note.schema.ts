import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true, collection: 'interview_notes' })
export class Note {
  @Prop({ required: true, index: true })
  jobApplicationId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    enum: ['PHONE_SCREEN', 'TECHNICAL', 'HR', 'GENERAL', 'FOLLOW_UP'],
    default: 'GENERAL',
  })
  type: string;

  @Prop()
  interviewDate: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
