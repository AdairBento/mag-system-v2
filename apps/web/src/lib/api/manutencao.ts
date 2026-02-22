import { apiClient } from './http';
import type { Maintenance, PaginatedResponse } from '@/types/manutencao';

export interface MaintenanceFilters {
  vehicleId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const manutencaoApi = {
  list: (filters?: MaintenanceFilters): Promise<PaginatedResponse<Maintenance>> => {
    const p = new URLSearchParams();
    if (filters?.vehicleId) p.set('vehicleId', filters.vehicleId);
    if (filters?.type) p.set('type', filters.type);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Maintenance>>(`/maintenance?${p}`);
  },

  getById: (id: string): Promise<Maintenance> => apiClient.get<Maintenance>(`/maintenance/${id}`),

  getByVehicle: (vehicleId: string): Promise<Maintenance[]> =>
    apiClient.get<Maintenance[]>(`/maintenance/vehicle/${vehicleId}`),

  create: (data: Partial<Maintenance>): Promise<Maintenance> =>
    apiClient.post<Maintenance>('/maintenance', data),

  update: (id: string, data: Partial<Maintenance>): Promise<Maintenance> =>
    apiClient.put<Maintenance>(`/maintenance/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/maintenance/${id}`),
};
