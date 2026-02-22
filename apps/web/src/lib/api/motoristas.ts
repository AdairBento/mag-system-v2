import { apiClient } from './http';
import type { Motorista, PaginatedResponse, DriverStatus } from '@/types/motorista';

export interface MotoristasFilters {
  search?: string;
  status?: DriverStatus;
  clientId?: string;
  skip?: number;
  take?: number;
}

export const motoristasApi = {
  list: (filters?: MotoristasFilters): Promise<PaginatedResponse<Motorista>> => {
    const p = new URLSearchParams();
    if (filters?.search) p.set('search', filters.search);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.clientId) p.set('clientId', filters.clientId);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Motorista>>(`/drivers?${p}`);
  },

  getById: (id: string): Promise<Motorista> => apiClient.get<Motorista>(`/drivers/${id}`),

  delete: (id: string): Promise<void> => apiClient.delete(`/drivers/${id}`),
};
