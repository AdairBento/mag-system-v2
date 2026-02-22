import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sinistrosApi, type SinistroFilters } from '@/lib/api/sinistros';
import type { Sinistro } from '@/types/sinistro';

const QUERY_KEY = 'sinistros';

export function useSinistros(filters?: SinistroFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => sinistrosApi.list(filters),
  });
}

export function useCreateSinistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Sinistro>) => sinistrosApi.create(data),
    onSuccess: () => {
      toast.success('Sinistro registrado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao registrar sinistro'),
  });
}

export function useUpdateSinistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sinistro> }) =>
      sinistrosApi.update(id, data),
    onSuccess: () => {
      toast.success('Sinistro atualizado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar sinistro'),
  });
}

export function useDeleteSinistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sinistrosApi.delete(id),
    onSuccess: () => {
      toast.success('Sinistro removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover sinistro'),
  });
}
