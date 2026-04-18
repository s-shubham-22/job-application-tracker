import { Note } from '@/types/note.types';
import { NOTE_TYPE_LABELS } from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatters';
import { useDeleteNote } from '@/hooks/useNotes';
import { Trash2, Calendar, Clock } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  jobId: string;
}

const TYPE_COLORS: Record<string, string> = {
  PHONE_SCREEN: '#3b82f6',
  TECHNICAL: '#8b5cf6',
  HR: '#10b981',
  GENERAL: '#6b7280',
  FOLLOW_UP: '#f59e0b',
};

export default function NoteList({ notes, jobId }: NoteListProps) {
  const deleteNote = useDeleteNote(jobId);

  if (notes.length === 0) {
    return (
      <div style={{
        border: '2px dashed var(--border-subtle)',
        borderRadius: 12, padding: 32,
        textAlign: 'center', color: 'var(--text-muted)',
      }}>
        <p style={{ fontSize: 14, marginBottom: 4 }}>No notes yet</p>
        <p style={{ fontSize: 12 }}>Add your first interview note above</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <span style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                color: TYPE_COLORS[note.type] || '#6b7280',
                background: `${TYPE_COLORS[note.type] || '#6b7280'}18`,
                border: `1px solid ${TYPE_COLORS[note.type] || '#6b7280'}30`,
                marginBottom: 6,
              }}>
                {NOTE_TYPE_LABELS[note.type] || note.type}
              </span>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {note.title}
              </h4>
            </div>
            <button
              onClick={() => deleteNote.mutate(note._id)}
              className="btn-danger"
              style={{ padding: '6px', border: 'none', background: 'none' }}
              title="Delete note"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Content */}
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: '0 0 10px' }}>
            {note.content}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            {note.interviewDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={11} /> {formatDate(note.interviewDate)}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {timeAgo(note.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
