import { useQuery } from '@tanstack/react-query';
import { notificacoesApi, type NotificationFilters } from '@/lib/api/notificacoes';

const QUERY_KEY = 'notifications';

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => notificacoesApi.list(filters),
  });
}

export function useRecentNotifications() {
  return useQuery({
    queryKey: [QUERY_KEY, 'recent'],
    queryFn: () => notificacoesApi.recent(),
  });
}
