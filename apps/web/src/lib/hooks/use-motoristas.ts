import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motoristasApi, type MotoristasFilters } from '@/lib/api/motoristas';

const QUERY_KEY = 'motoristas';

export function useMotoristas(filters?: MotoristasFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => motoristasApi.list(filters),
  });
}

export function useDeleteMotorista() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => motoristasApi.delete(id),
    onSuccess: () => {
      toast.success('Motorista removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover motorista'),
  });
}
