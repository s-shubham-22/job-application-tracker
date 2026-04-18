import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateNote } from '@/hooks/useNotes';
import { NoteType } from '@/types/note.types';
import { NOTE_TYPE_LABELS } from '@/utils/constants';
import { PlusCircle, FileText, Calendar } from 'lucide-react';
import Select from '@/components/ui/Select';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['PHONE_SCREEN', 'TECHNICAL', 'HR', 'GENERAL', 'FOLLOW_UP']).optional(),
  interviewDate: z.string().optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  jobId: string;
}

export default function NoteEditor({ jobId }: NoteEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createNote = useCreateNote(jobId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { type: 'GENERAL' },
  });

  const onSubmit = async (values: NoteFormValues) => {
    await createNote.mutateAsync({
      title: values.title,
      content: values.content,
      type: values.type as NoteType,
      interviewDate: values.interviewDate || undefined,
    });
    reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <PlusCircle size={16} />
        Add Note
      </button>
    );
  }

  return (
    <div className="note-card" style={{ marginBottom: 16 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
        New Interview Note
      </h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label className="label">Title *</label>
          <input className={`input ${errors.title ? 'error' : ''}`} placeholder="e.g. Technical Round 1" {...register('title')} />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className="label">Type</label>
            <Select className="input" {...register('type')}>
              {Object.entries(NOTE_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Interview Date</label>
            <input type="date" className="input" {...register('interviewDate')} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="label"><FileText size={12} style={{ display: 'inline', marginRight: 4 }} />Content *</label>
          <textarea className={`input ${errors.content ? 'error' : ''}`} rows={4} placeholder="What happened in this interview? Questions asked, your performance..." {...register('content')} />
          {errors.content && <p className="error-text">{errors.content.message}</p>}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn-primary" disabled={createNote.isPending}>
            {createNote.isPending ? 'Saving...' : 'Save Note'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => { reset(); setIsOpen(false); }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
