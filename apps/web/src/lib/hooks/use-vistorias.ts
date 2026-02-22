import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vistoriasApi } from '@/lib/api/vistorias';

const DAMAGE_KEY = 'vistorias-damages';
const PHOTO_KEY = 'vistorias-photos';
const SUMMARY_KEY = 'vistorias-summary';

export function useVistoriasDamages(inspectionId: string) {
  return useQuery({
    queryKey: [DAMAGE_KEY, inspectionId],
    queryFn: () => vistoriasApi.getDamages(inspectionId),
    enabled: !!inspectionId,
  });
}

export function useVistoriasPhotos(inspectionId: string) {
  return useQuery({
    queryKey: [PHOTO_KEY, inspectionId],
    queryFn: () => vistoriasApi.getPhotos(inspectionId),
    enabled: !!inspectionId,
  });
}

export function useVistoriasSummary(inspectionId: string) {
  return useQuery({
    queryKey: [SUMMARY_KEY, inspectionId],
    queryFn: () => vistoriasApi.getSummary(inspectionId),
    enabled: !!inspectionId,
  });
}

export function useDeleteDamage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vistoriasApi.deleteDamage(id),
    onSuccess: () => {
      toast.success('Dano removido!');
      queryClient.invalidateQueries({ queryKey: [DAMAGE_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao remover dano'),
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vistoriasApi.deletePhoto(id),
    onSuccess: () => {
      toast.success('Foto removida!');
      queryClient.invalidateQueries({ queryKey: [PHOTO_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao remover foto'),
  });
}
