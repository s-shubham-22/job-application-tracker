import { ApplicationStatus } from '@/types/job.types';
import { STATUS_LABELS, STATUS_COLORS, STATUS_BG } from '@/utils/constants';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className="status-badge"
      style={{
        color: STATUS_COLORS[status],
        background: STATUS_BG[status],
        border: `1px solid ${STATUS_COLORS[status]}30`,
        fontSize: size === 'sm' ? '10px' : '11px',
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
