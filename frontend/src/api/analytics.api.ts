import apiClient from './axios';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

export interface AnalyticsSummary {
  total: number;
  byStatus: Record<string, number>;
  responseRate: string;
  offerRate: string;
}

export interface TimelineEntry {
  month: string;
  count: number;
}

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const res = await apiClient.get<ApiWrapper<AnalyticsSummary>>('/analytics/summary');
    return res.data.data;
  },

  getTimeline: async (): Promise<TimelineEntry[]> => {
    const res = await apiClient.get<ApiWrapper<TimelineEntry[]>>('/analytics/timeline');
    return res.data.data;
  },
};
