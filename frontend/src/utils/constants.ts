import { ApplicationStatus } from '@/types/job.types';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.WISHLIST]: 'Wishlist',
  [ApplicationStatus.APPLIED]: 'Applied',
  [ApplicationStatus.SCREENING]: 'Screening',
  [ApplicationStatus.INTERVIEW]: 'Interview',
  [ApplicationStatus.OFFER]: 'Offer',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.WITHDRAWN]: 'Withdrawn',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.WISHLIST]: '#8b5cf6',
  [ApplicationStatus.APPLIED]: '#3b82f6',
  [ApplicationStatus.SCREENING]: '#f59e0b',
  [ApplicationStatus.INTERVIEW]: '#10b981',
  [ApplicationStatus.OFFER]: '#22c55e',
  [ApplicationStatus.REJECTED]: '#ef4444',
  [ApplicationStatus.WITHDRAWN]: '#6b7280',
};

export const STATUS_BG: Record<ApplicationStatus, string> = {
  [ApplicationStatus.WISHLIST]: 'rgba(139,92,246,0.12)',
  [ApplicationStatus.APPLIED]: 'rgba(59,130,246,0.12)',
  [ApplicationStatus.SCREENING]: 'rgba(245,158,11,0.12)',
  [ApplicationStatus.INTERVIEW]: 'rgba(16,185,129,0.12)',
  [ApplicationStatus.OFFER]: 'rgba(34,197,94,0.12)',
  [ApplicationStatus.REJECTED]: 'rgba(239,68,68,0.12)',
  [ApplicationStatus.WITHDRAWN]: 'rgba(107,114,128,0.12)',
};

export const STATUS_ORDER: ApplicationStatus[] = [
  ApplicationStatus.WISHLIST,
  ApplicationStatus.APPLIED,
  ApplicationStatus.SCREENING,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
];

export const NOTE_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: 'Phone Screen',
  TECHNICAL: 'Technical',
  HR: 'HR Round',
  GENERAL: 'General',
  FOLLOW_UP: 'Follow Up',
};

export const QUERY_KEYS = {
  jobs: 'jobs',
  job: (id: string) => ['job', id],
  notes: (jobId: string) => ['notes', jobId],
  analytics: 'analytics',
  analyticsSummary: 'analytics-summary',
  analyticsTimeline: 'analytics-timeline',
  activityLogs: (jobId: string) => ['activity', jobId],
};
