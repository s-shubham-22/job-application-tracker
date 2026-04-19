import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';
import { QUERY_KEYS } from '@/utils/constants';

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.analyticsSummary],
    queryFn: () => analyticsApi.getSummary(),
    staleTime: 30_000,
  });
};

export const useAnalyticsTimeline = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.analyticsTimeline],
    queryFn: () => analyticsApi.getTimeline(),
    staleTime: 30_000,
  });
};
