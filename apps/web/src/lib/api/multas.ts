import { apiClient } from './http';
import type { Multa, PaginatedResponse } from '@/types/multa';

export interface MultaFilters {
  vehicleId?: string;
  driverId?: string;
  status?: string;
  skip?: number;
  take?: number;
}

export const multasApi = {
  list: (filters?: MultaFilters): Promise<PaginatedResponse<Multa>> => {
    const p = new URLSearchParams();
    if (filters?.vehicleId) p.set('vehicleId', filters.vehicleId);
    if (filters?.driverId) p.set('driverId', filters.driverId);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Multa>>(`/multas?${p}`);
  },

  getById: (id: string): Promise<Multa> => apiClient.get<Multa>(`/multas/${id}`),

  create: (data: Partial<Multa>): Promise<Multa> => apiClient.post<Multa>('/multas', data),

  update: (id: string, data: Partial<Multa>): Promise<Multa> =>
    apiClient.put<Multa>(`/multas/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/multas/${id}`),
};
