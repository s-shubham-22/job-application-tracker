export const ApplicationStatus = {
  WISHLIST: 'WISHLIST',
  APPLIED: 'APPLIED',
  SCREENING: 'SCREENING',
  INTERVIEW: 'INTERVIEW',
  OFFER: 'OFFER',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export interface Company {
  id: string;
  name: string;
  website?: string;
  location?: string;
}

export interface StatusHistory {
  id: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  note?: string;
  changedAt: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  jobUrl?: string;
  status: ApplicationStatus;
  salary?: string;
  location?: string;
  description?: string;
  followUpDate?: string;
  reminderSent: boolean;
  appliedAt: string;
  updatedAt: string;
  company: Company;
  statusHistory?: StatusHistory[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryJobsParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus | '';
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateJobPayload {
  jobTitle: string;
  companyName: string;
  companyWebsite?: string;
  companyLocation?: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
  description?: string;
  status?: ApplicationStatus;
  followUpDate?: string;
}

export type UpdateJobPayload = Partial<CreateJobPayload>;
export type UpdateJobDto = Partial<CreateJobPayload>;

export interface UpdateStatusPayload {
  status: ApplicationStatus;
  note?: string;
}

export interface ActivityLog {
  _id: string;
  jobApplicationId: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: string;
}
