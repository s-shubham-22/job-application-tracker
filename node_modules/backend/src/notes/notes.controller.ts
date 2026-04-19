import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('job/:jobId')
  @ApiOperation({ summary: 'Add an interview note to a job application' })
  createNote(
    @CurrentUser() user: { id: string },
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.createNote(user.id, jobId, dto);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get all notes for a job application' })
  findByJob(
    @CurrentUser() user: { id: string },
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ) {
    return this.notesService.findByJob(user.id, jobId);
  }

  @Patch(':noteId')
  @ApiOperation({ summary: 'Update a note by MongoDB ID' })
  updateNote(
    @CurrentUser() user: { id: string },
    @Param('noteId', ParseObjectIdPipe) noteId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.updateNote(user.id, noteId, dto);
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note by MongoDB ID' })
  deleteNote(
    @CurrentUser() user: { id: string },
    @Param('noteId', ParseObjectIdPipe) noteId: string,
  ) {
    return this.notesService.deleteNote(user.id, noteId);
  }
}
