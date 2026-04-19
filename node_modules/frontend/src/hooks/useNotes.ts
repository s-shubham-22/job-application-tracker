import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/api/notes.api';
import { QUERY_KEYS } from '@/utils/constants';
import { CreateNotePayload, UpdateNotePayload } from '@/types/note.types';
import toast from 'react-hot-toast';

export const useNotes = (jobId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.notes(jobId),
    queryFn: () => notesApi.getNotesByJob(jobId),
    enabled: !!jobId,
  });
};

export const useCreateNote = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotePayload) => notesApi.createNote(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes(jobId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activityLogs(jobId) });
      toast.success('Note added!');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });
};

export const useUpdateNote = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: UpdateNotePayload }) =>
      notesApi.updateNote(noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes(jobId) });
      toast.success('Note updated!');
    },
    onError: () => {
      toast.error('Failed to update note');
    },
  });
};

export const useDeleteNote = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => notesApi.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes(jobId) });
      toast.success('Note deleted');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });
};
