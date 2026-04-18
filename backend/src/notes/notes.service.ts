import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ActivityLog } from './schemas/activity-log.schema';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLog>,
    @InjectRepository(JobApplication)
    private readonly jobsRepo: Repository<JobApplication>,
  ) {}

  private async validateJobOwnership(jobId: string, userId: string): Promise<JobApplication> {
    const job = await this.jobsRepo.findOne({
      where: { id: jobId, user: { id: userId } },
    });
    if (!job) {
      throw new ForbiddenException(
        'Job application not found or does not belong to you',
      );
    }
    return job;
  }

  async createNote(
    userId: string,
    jobId: string,
    dto: CreateNoteDto,
  ): Promise<NoteDocument> {
    await this.validateJobOwnership(jobId, userId);

    const note = await this.noteModel.create({
      jobApplicationId: jobId,
      userId,
      title: dto.title,
      content: dto.content,
      type: dto.type || 'GENERAL',
      interviewDate: dto.interviewDate ? new Date(dto.interviewDate) : undefined,
    });

    // Log activity
    await this.activityLogModel.create({
      jobApplicationId: jobId,
      userId,
      action: 'NOTE_ADDED',
      metadata: { noteId: note._id.toString(), title: dto.title, type: dto.type },
    });

    return note;
  }

  async findByJob(userId: string, jobId: string): Promise<NoteDocument[]> {
    await this.validateJobOwnership(jobId, userId);
    return this.noteModel
      .find({ jobApplicationId: jobId, userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateNote(
    userId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('You do not have permission to edit this note');
    }

    Object.assign(note, {
      ...(dto.title && { title: dto.title }),
      ...(dto.content && { content: dto.content }),
      ...(dto.type && { type: dto.type }),
      ...(dto.interviewDate && { interviewDate: new Date(dto.interviewDate) }),
    });

    return note.save();
  }

  async deleteNote(userId: string, noteId: string): Promise<void> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this note');
    }
    await this.noteModel.deleteOne({ _id: noteId }).exec();
  }
}
