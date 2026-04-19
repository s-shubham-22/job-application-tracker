import apiClient from './axios';
import {
  JobApplication,
  PaginatedResponse,
  QueryJobsParams,
  CreateJobPayload,
  UpdateJobPayload,
  UpdateStatusPayload,
  ActivityLog,
} from '@/types/job.types';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

export const jobsApi = {
  getJobs: async (params: QueryJobsParams): Promise<PaginatedResponse<JobApplication>> => {
    const cleanParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    }
    const res = await apiClient.get<ApiWrapper<PaginatedResponse<JobApplication>>>('/jobs', { params: cleanParams });
    return res.data.data;
  },

  getJob: async (id: string): Promise<JobApplication> => {
    const res = await apiClient.get<ApiWrapper<JobApplication>>(`/jobs/${id}`);
    return res.data.data;
  },

  createJob: async (data: CreateJobPayload): Promise<JobApplication> => {
    const res = await apiClient.post<ApiWrapper<JobApplication>>('/jobs', data);
    return res.data.data;
  },

  updateJob: async (id: string, data: UpdateJobPayload): Promise<JobApplication> => {
    const res = await apiClient.patch<ApiWrapper<JobApplication>>(`/jobs/${id}`, data);
    return res.data.data;
  },

  updateJobStatus: async (id: string, data: UpdateStatusPayload): Promise<JobApplication> => {
    const res = await apiClient.patch<ApiWrapper<JobApplication>>(`/jobs/${id}/status`, data);
    return res.data.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient.delete(`/jobs/${id}`);
  },

  getActivityLogs: async (jobId: string): Promise<ActivityLog[]> => {
    const res = await apiClient.get<ApiWrapper<ActivityLog[]>>(`/jobs/${jobId}/activity`);
    return res.data.data;
  },

  exportToExcel: async (): Promise<void> => {
    const res = await apiClient.get('/jobs/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'job-applications.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
