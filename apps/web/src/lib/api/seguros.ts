import { apiClient } from './http';
import type { Seguro, PaginatedResponse } from '@/types/seguro';

export interface SeguroFilters {
  vehicleId?: string;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const segurosApi = {
  list: (filters?: SeguroFilters): Promise<PaginatedResponse<Seguro>> => {
    const p = new URLSearchParams();
    if (filters?.vehicleId) p.set('vehicleId', filters.vehicleId);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.provider) p.set('provider', filters.provider);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Seguro>>(`/seguros?${p}`);
  },

  getById: (id: string): Promise<Seguro> => apiClient.get<Seguro>(`/seguros/${id}`),

  getActive: (): Promise<Seguro[]> => apiClient.get<Seguro[]>('/seguros/active'),

  getByVehicle: (vehicleId: string): Promise<Seguro[]> =>
    apiClient.get<Seguro[]>(`/seguros/vehicle/${vehicleId}`),

  create: (data: Partial<Seguro>): Promise<Seguro> => apiClient.post<Seguro>('/seguros', data),

  update: (id: string, data: Partial<Seguro>): Promise<Seguro> =>
    apiClient.put<Seguro>(`/seguros/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/seguros/${id}`),
};
