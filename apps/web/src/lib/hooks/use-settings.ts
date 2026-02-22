import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/api/settings';

const QUERY_KEY = 'settings';

export function useSettings(search?: string, skip?: number, take?: number) {
  return useQuery({
    queryKey: [QUERY_KEY, search, skip, take],
    queryFn: () => settingsApi.list(search, skip, take),
  });
}

export function useUpsertSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, type }: { key: string; value: string; type?: string }) =>
      settingsApi.upsertByKey(key, value, type),
    onSuccess: () => {
      toast.success('Configuração salva!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao salvar configuração'),
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.delete(id),
    onSuccess: () => {
      toast.success('Configuração removida!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover'),
  });
}
