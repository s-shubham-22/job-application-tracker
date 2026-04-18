import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ApplicationStatus, JobApplication } from '@/types/job.types';
import { STATUS_ORDER } from '@/utils/constants';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';
import { useUpdateJobStatus } from '@/hooks/useJobs';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onAddJob: (status: ApplicationStatus) => void;
}

export default function KanbanBoard({ jobs, onAddJob }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);
  const updateStatus = useUpdateJobStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const jobsByStatus = STATUS_ORDER.reduce<Record<ApplicationStatus, JobApplication[]>>(
    (acc, status) => ({
      ...acc,
      [status]: jobs.filter((j) => j.status === status),
    }),
    {} as Record<ApplicationStatus, JobApplication[]>,
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const job = jobs.find((j) => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveJob(null);
    if (!over || active.id === over.id) return;

    const newStatus = over.id as ApplicationStatus;
    const job = jobs.find((j) => j.id === active.id);

    if (!job || job.status === newStatus) return;

    updateStatus.mutate({ id: job.id, data: { status: newStatus } });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          padding: '4px 4px 16px',
          minHeight: 600,
        }}
      >
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobsByStatus[status] || []}
            onAddJob={onAddJob}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob && (
          <div style={{ opacity: 0.9, transform: 'rotate(2deg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <JobCard job={activeJob} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
