import { apiClient } from './http';
import type { Sinistro, PaginatedResponse } from '@/types/sinistro';

export interface SinistroFilters {
  vehicleId?: string;
  severity?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const sinistrosApi = {
  list: (filters?: SinistroFilters): Promise<PaginatedResponse<Sinistro>> => {
    const p = new URLSearchParams();
    if (filters?.vehicleId) p.set('vehicleId', filters.vehicleId);
    if (filters?.severity) p.set('severity', filters.severity);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Sinistro>>(`/sinistros?${p}`);
  },

  getById: (id: string): Promise<Sinistro> => apiClient.get<Sinistro>(`/sinistros/${id}`),

  create: (data: Partial<Sinistro>): Promise<Sinistro> =>
    apiClient.post<Sinistro>('/sinistros', data),

  update: (id: string, data: Partial<Sinistro>): Promise<Sinistro> =>
    apiClient.put<Sinistro>(`/sinistros/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/sinistros/${id}`),
};
