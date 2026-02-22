import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { locacoesApi, type LocacaoFilters } from '@/lib/api/locacoes';

const QUERY_KEY = 'locacoes';

export function useLocacoes(filters?: LocacaoFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => locacoesApi.list(filters),
  });
}

export function useDeleteLocacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => locacoesApi.delete(id),
    onSuccess: () => {
      toast.success('Locação removida!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover locação'),
  });
}
