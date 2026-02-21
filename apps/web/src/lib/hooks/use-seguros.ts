import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { segurosApi, type SeguroFilters } from '@/lib/api/seguros';
import type { Seguro } from '@/types/seguro';

const QUERY_KEY = 'seguros';

export function useSeguros(filters?: SeguroFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => segurosApi.list(filters),
  });
}

export function useDeleteSeguro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => segurosApi.delete(id),
    onSuccess: () => {
      toast.success('Seguro removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover seguro'),
  });
}
