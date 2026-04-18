import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import {
  ActivityLog,
  ActivityLogSchema,
} from './schemas/activity-log.schema';
import { Note, NoteSchema } from './schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
    TypeOrmModule.forFeature([JobApplication]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService, MongooseModule],
})
export class NotesModule {}
