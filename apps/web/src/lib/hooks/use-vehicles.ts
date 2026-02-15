import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vehiclesApi } from '@/lib/api/vehicles';
import type { VehicleFilters, CreateVehicleDto, UpdateVehicleDto } from '@/types/vehicle';

const QUERY_KEY = 'vehicles';

export function useVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => vehiclesApi.list(filters),
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => vehiclesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesApi.create(data),
    onSuccess: () => {
      toast.success('Veículo criado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao criar veículo'),
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) =>
      vehiclesApi.update(id, data),
    onSuccess: () => {
      toast.success('Veículo atualizado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar'),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.delete(id),
    onSuccess: () => {
      toast.success('Veículo removido!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => toast.error('Erro ao remover'),
  });
}
