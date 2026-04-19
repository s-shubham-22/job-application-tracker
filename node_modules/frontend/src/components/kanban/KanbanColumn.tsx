import { useDroppable } from '@dnd-kit/core';
import { JobApplication, ApplicationStatus } from '@/types/job.types';
import JobCard from './JobCard';
import { STATUS_LABELS, STATUS_COLORS } from '@/utils/constants';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: ApplicationStatus;
  jobs: JobApplication[];
  onAddJob: (status: ApplicationStatus) => void;
}

export default function KanbanColumn({ status, jobs, onAddJob }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column${isOver ? ' drag-over' : ''}`}
      style={{
        minWidth: 280,
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Column Header */}
      <div style={{
        padding: '14px 14px 10px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: STATUS_COLORS[status],
            boxShadow: `0 0 6px ${STATUS_COLORS[status]}80`,
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: STATUS_COLORS[status] }}>
            {STATUS_LABELS[status]}
          </span>
          <span style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 20,
            padding: '0 8px',
            fontSize: 11,
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}>
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddJob(status)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, borderRadius: 6,
            display: 'flex', alignItems: 'center',
          }}
          title={`Add to ${STATUS_LABELS[status]}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {jobs.length === 0 ? (
          <div style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: 10, padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 12,
          }}>
            Drop here
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
