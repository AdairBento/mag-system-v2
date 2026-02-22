import { apiClient } from './http';
import type { Contract, PaginatedResponse } from '@/types/contrato';

export interface ContractFilters {
  rentalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const contratosApi = {
  list: (filters?: ContractFilters): Promise<PaginatedResponse<Contract>> => {
    const p = new URLSearchParams();
    if (filters?.rentalId) p.set('rentalId', filters.rentalId);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Contract>>(`/contracts?${p}`);
  },

  getById: (id: string): Promise<Contract> => apiClient.get<Contract>(`/contracts/${id}`),

  create: (data: Partial<Contract>): Promise<Contract> =>
    apiClient.post<Contract>('/contracts', data),

  update: (id: string, data: Partial<Contract>): Promise<Contract> =>
    apiClient.put<Contract>(`/contracts/${id}`, data),

  sign: (id: string): Promise<Contract> => apiClient.post<Contract>(`/contracts/${id}/sign`, {}),

  delete: (id: string): Promise<void> => apiClient.delete(`/contracts/${id}`),
};
