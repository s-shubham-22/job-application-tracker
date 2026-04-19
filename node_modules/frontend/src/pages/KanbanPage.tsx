import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import JobForm from '@/components/jobs/JobForm';
import { useJobs } from '@/hooks/useJobs';
import { ApplicationStatus } from '@/types/job.types';
import { Plus, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';

export default function KanbanPage() {
  const [showJobForm, setShowJobForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>(ApplicationStatus.APPLIED);
  const queryClient = useQueryClient();

  // Fetch all jobs without pagination for Kanban
  const { data, isLoading, error } = useJobs({ page: 1, limit: 1000 });

  const handleAddJob = (status: ApplicationStatus) => {
    setDefaultStatus(status);
    setShowJobForm(true);
  };

  return (
    <AppLayout>
      <div style={{ padding: '24px 28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>Kanban Board</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Drag and drop to update application status
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn-secondary"
              onClick={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] })}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button className="btn-primary" onClick={() => handleAddJob(ApplicationStatus.APPLIED)}>
              <Plus size={16} />
              Add Application
            </button>
          </div>
        </div>

        {/* Total badge */}
        {data && (
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{data.total}</strong> applications
          </div>
        )}

        {/* Board */}
        {isLoading ? (
          <div className="kanban-skeleton-container">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ width: 280, height: 500, borderRadius: 14, flexShrink: 0 }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: 24 }}>Failed to load applications</div>
        ) : data ? (
          <KanbanBoard jobs={data.items} onAddJob={handleAddJob} />
        ) : null}
      </div>

      {showJobForm && (
        <JobForm onClose={() => setShowJobForm(false)} defaultStatus={defaultStatus} />
      )}
    </AppLayout>
  );
}
