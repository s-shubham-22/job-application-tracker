import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';
import { QUERY_KEYS } from '@/utils/constants';
import { QueryJobsParams, CreateJobPayload, UpdateJobPayload, UpdateStatusPayload } from '@/types/job.types';
import toast from 'react-hot-toast';

export const useJobs = (params: QueryJobsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.jobs, params],
    queryFn: () => jobsApi.getJobs(params),
    placeholderData: (prev) => prev,
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.job(id),
    queryFn: () => jobsApi.getJob(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobPayload) => jobsApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.analyticsSummary] });
      toast.success('Application added successfully!');
    },
    onError: () => {
      toast.error('Failed to create application');
    },
  });
};

export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateJobPayload) => jobsApi.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(id) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
      toast.success('Application updated!');
    },
    onError: () => {
      toast.error('Failed to update application');
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusPayload }) =>
      jobsApi.updateJobStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(id) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.analyticsSummary] });
      toast.success('Status updated!');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.analyticsSummary] });
      toast.success('Application deleted');
    },
    onError: () => {
      toast.error('Failed to delete application');
    },
  });
};

export const useActivityLogs = (jobId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.activityLogs(jobId),
    queryFn: () => jobsApi.getActivityLogs(jobId),
    enabled: !!jobId,
  });
};
