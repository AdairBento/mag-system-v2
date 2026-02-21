import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { manutencaoApi, type MaintenanceFilters } from '@/lib/api/manutencao';
import type { Maintenance } from '@/types/manutencao';

const QUERY_KEY = 'maintenance';

export function useManutencao(filters?: MaintenanceFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => manutencaoApi.list(filters),
  });
}

export function useCreateManutencao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Maintenance>) => manutencaoApi.create(data),
    onSuccess: () => {
      toast.success('Manutenção registrada!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao registrar manutenção'),
  });
}

export function useUpdateManutencao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Maintenance> }) =>
      manutencaoApi.update(id, data),
    onSuccess: () => {
      toast.success('Manutenção atualizada!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar'),
  });
}

export function useDeleteManutencao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => manutencaoApi.delete(id),
    onSuccess: () => {
      toast.success('Registro removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover'),
  });
}
