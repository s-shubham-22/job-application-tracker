export type NoteType = 'PHONE_SCREEN' | 'TECHNICAL' | 'HR' | 'GENERAL' | 'FOLLOW_UP';

export interface Note {
  _id: string;
  jobApplicationId: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  interviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  type?: NoteType;
  interviewDate?: string;
}

export type UpdateNotePayload = Partial<CreateNotePayload>;
