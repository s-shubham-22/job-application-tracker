import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication } from '@/types/job.types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, DollarSign, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: JobApplication;
}

export default function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: { job },
  });



  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => navigate(`/applications/${job.id}`)}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'box-shadow 0.2s',
        padding: 14,
        marginBottom: 8,
        borderRadius: 10,
        userSelect: 'none',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Company + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Building2 size={13} color="var(--color-brand-400)" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {job.company?.name}
          </span>
        </div>
        <StatusBadge status={job.status} size="sm" />
      </div>

      {/* Title */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>
        {job.jobTitle}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {job.salary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
            <DollarSign size={11} />
            {job.salary}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
          <Calendar size={11} />
          {formatDate(job.appliedAt)}
        </div>
      </div>

      {/* Link */}
      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: 'var(--color-brand-400)' }}
        >
          <ExternalLink size={10} /> View listing
        </a>
      )}
    </div>
  );
}
