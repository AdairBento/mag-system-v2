import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contratosApi, type ContractFilters } from '@/lib/api/contratos';
import type { Contract } from '@/types/contrato';

const QUERY_KEY = 'contracts';

export function useContratos(filters?: ContractFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => contratosApi.list(filters),
  });
}

export function useContrato(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => contratosApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Contract>) => contratosApi.create(data),
    onSuccess: () => {
      toast.success('Contrato criado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao criar contrato'),
  });
}

export function useSignContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contratosApi.sign(id),
    onSuccess: () => {
      toast.success('Contrato assinado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao assinar contrato'),
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contratosApi.delete(id),
    onSuccess: () => {
      toast.success('Contrato removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover contrato'),
  });
}
