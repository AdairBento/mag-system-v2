import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { multasApi, type MultaFilters } from '@/lib/api/multas';
import type { Multa } from '@/types/multa';

const QUERY_KEY = 'multas';

export function useMultas(filters?: MultaFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => multasApi.list(filters),
  });
}

export function useUpdateMulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Multa> }) => multasApi.update(id, data),
    onSuccess: () => {
      toast.success('Multa atualizada!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar multa'),
  });
}

export function useDeleteMulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => multasApi.delete(id),
    onSuccess: () => {
      toast.success('Multa removida!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover multa'),
  });
}
