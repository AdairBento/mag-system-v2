import { apiClient } from './http';
import type { Damage, Photo, InspectionSummary } from '@/types/vistoria';

export const vistoriasApi = {
  // Damages
  getDamages: (inspectionId: string): Promise<Damage[]> =>
    apiClient.get<Damage[]>(`/vistorias/damages/${inspectionId}`),

  createDamage: (data: Partial<Damage>): Promise<Damage> =>
    apiClient.post<Damage>('/vistorias/damages', data),

  updateDamage: (id: string, data: Partial<Damage>): Promise<Damage> =>
    apiClient.patch<Damage>(`/vistorias/damages/${id}`, data),

  deleteDamage: (id: string): Promise<void> => apiClient.delete(`/vistorias/damages/${id}`),

  // Photos
  getPhotos: (inspectionId: string): Promise<Photo[]> =>
    apiClient.get<Photo[]>(`/vistorias/photos/${inspectionId}`),

  createPhoto: (data: Partial<Photo>): Promise<Photo> =>
    apiClient.post<Photo>('/vistorias/photos', data),

  deletePhoto: (id: string): Promise<void> => apiClient.delete(`/vistorias/photos/${id}`),

  // Summary
  getSummary: (inspectionId: string): Promise<InspectionSummary> =>
    apiClient.get<InspectionSummary>(`/vistorias/summary/${inspectionId}`),
};
