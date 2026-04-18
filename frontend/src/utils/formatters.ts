import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'MMM d, yyyy');
  } catch {
    return '—';
  }
};

export const formatDateTime = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return '—';
  }
};

export const timeAgo = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const formatSalary = (salary?: string | null): string => {
  if (!salary) return 'Not specified';
  return salary;
};

export const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

export const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    JOB_CREATED: 'Application created',
    STATUS_CHANGED: 'Status changed',
    NOTE_ADDED: 'Note added',
    REMINDER_SET: 'Reminder set',
  };
  return labels[action] || action.replace(/_/g, ' ').toLowerCase();
};
