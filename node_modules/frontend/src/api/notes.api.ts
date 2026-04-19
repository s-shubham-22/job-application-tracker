import apiClient from './axios';
import { Note, CreateNotePayload, UpdateNotePayload } from '@/types/note.types';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

export const notesApi = {
  getNotesByJob: async (jobId: string): Promise<Note[]> => {
    const res = await apiClient.get<ApiWrapper<Note[]>>(`/notes/job/${jobId}`);
    return res.data.data;
  },

  createNote: async (jobId: string, data: CreateNotePayload): Promise<Note> => {
    const res = await apiClient.post<ApiWrapper<Note>>(`/notes/job/${jobId}`, data);
    return res.data.data;
  },

  updateNote: async (noteId: string, data: UpdateNotePayload): Promise<Note> => {
    const res = await apiClient.patch<ApiWrapper<Note>>(`/notes/${noteId}`, data);
    return res.data.data;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await apiClient.delete(`/notes/${noteId}`);
  },
};
