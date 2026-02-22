import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { filaApi } from '@/lib/api/fila';
import type { JobStatus } from '@/types/fila';

const QUERY_KEY = 'queue';

export function useQueueJobs(status?: JobStatus) {
  return useQuery({
    queryKey: [QUERY_KEY, status],
    queryFn: () => filaApi.list(status),
  });
}

export function useEnqueueJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: filaApi.enqueue,
    onSuccess: () => {
      toast.success('Job enfileirado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao enfileirar job'),
  });
}

export function useProcessJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filaApi.process(id),
    onSuccess: () => {
      toast.success('Job processado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao processar job'),
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filaApi.cancel(id),
    onSuccess: () => {
      toast.success('Job cancelado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao cancelar job'),
  });
}
