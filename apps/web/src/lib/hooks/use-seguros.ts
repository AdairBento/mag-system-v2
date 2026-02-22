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

export function useCreateSeguro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Seguro>) => segurosApi.create(data),
    onSuccess: () => {
      toast.success('Seguro criado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao criar seguro'),
  });
}

export function useUpdateSeguro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Seguro> }) =>
      segurosApi.update(id, data),
    onSuccess: () => {
      toast.success('Seguro atualizado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar seguro'),
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
