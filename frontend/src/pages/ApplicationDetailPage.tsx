import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import NoteEditor from '@/components/notes/NoteEditor';
import NoteList from '@/components/notes/NoteList';
import { useJob, useDeleteJob, useUpdateJobStatus } from '@/hooks/useJobs';
import { useNotes } from '@/hooks/useNotes';
import { useActivityLogs } from '@/hooks/useJobs';
import { ApplicationStatus } from '@/types/job.types';
import { STATUS_LABELS, STATUS_ORDER } from '@/utils/constants';
import { formatDate, formatDateTime, getActionLabel, timeAgo } from '@/utils/formatters';
import {
  ArrowLeft, Building2, Calendar, DollarSign, Globe, MapPin,
  Trash2, FileText, Activity, GitBranch, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteJob = useDeleteJob();
  const updateStatus = useUpdateJobStatus();

  const { data: job, isLoading } = useJob(id!);
  const { data: notes = [] } = useNotes(id!);
  const { data: activityLogs = [] } = useActivityLogs(id!);

  const handleDelete = async () => {
    if (!confirm('Delete this application permanently?')) return;
    deleteJob.mutate(id!, { onSuccess: () => navigate('/applications') });
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (!job || job.status === newStatus) return;
    updateStatus.mutate({ id: id!, data: { status: newStatus } });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ padding: '32px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 40, marginBottom: 16, borderRadius: 8 }} />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout>
        <div style={{ padding: 32, color: '#ef4444' }}>Application not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: '24px 32px', maxWidth: 1200 }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/applications')}
          className="btn-secondary"
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={15} /> Back to Applications
        </button>

        {/* Header */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Building2 size={18} color="var(--color-brand-400)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{job.company?.name}</div>
                  {job.company?.website && (
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Globe size={10} /> {job.company.website}
                    </a>
                  )}
                </div>
              </div>
              <h1 style={{ fontSize: 26, marginBottom: 12 }}>{job.jobTitle}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><DollarSign size={13} /> {job.salary}</span>}
                {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {job.location}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} /> Applied {formatDate(job.appliedAt)}</span>
                {job.followUpDate && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} /> Follow up {formatDate(job.followUpDate)}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              <StatusBadge status={job.status} />
              <div style={{ display: 'flex', gap: 8 }}>
                {job.jobUrl && (
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 13 }}>
                    <ExternalLink size={13} /> View Job
                  </a>
                )}
                <button onClick={handleDelete} className="btn-danger">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>

          {job.description && (
            <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{job.description}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Left Column */}
          <div>
            {/* Status Change */}
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <GitBranch size={15} color="var(--color-brand-400)" /> Change Status
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={job.status === s ? 'btn-primary' : 'btn-secondary'}
                    style={{ fontSize: 12, padding: '6px 14px' }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Timeline */}
            {job.statusHistory && job.statusHistory.length > 0 && (
              <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={15} color="var(--color-brand-400)" /> Status Timeline
                </h3>
                <div>
                  {job.statusHistory.map((history) => (
                    <div key={history.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {STATUS_LABELS[history.fromStatus]} → {STATUS_LABELS[history.toStatus]}
                        </div>
                        {history.note && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>"{history.note}"</div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDateTime(history.changedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={15} color="var(--color-brand-400)" /> Interview Notes ({notes.length})
                </h3>
                <NoteEditor jobId={id!} />
              </div>
              <NoteList notes={notes} jobId={id!} />
            </div>
          </div>

          {/* Right sidebar — Activity Log */}
          <div className="card" style={{ padding: 20, alignSelf: 'start' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} color="var(--color-brand-400)" /> Activity Log
            </h3>
            {activityLogs.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No activity yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activityLogs.map((log) => (
                  <div key={log._id}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {getActionLabel(log.action)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(log.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
