import { apiClient } from './http';
import type { Locacao, PaginatedResponse, RentalStatus } from '@/types/locacao';

export interface LocacaoFilters {
  status?: RentalStatus;
  clientId?: string;
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const locacoesApi = {
  list: (filters?: LocacaoFilters): Promise<PaginatedResponse<Locacao>> => {
    const p = new URLSearchParams();
    if (filters?.status) p.set('status', filters.status);
    if (filters?.clientId) p.set('clientId', filters.clientId);
    if (filters?.vehicleId) p.set('vehicleId', filters.vehicleId);
    if (filters?.driverId) p.set('driverId', filters.driverId);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Locacao>>(`/rentals?${p}`);
  },

  getById: (id: string): Promise<Locacao> => apiClient.get<Locacao>(`/rentals/${id}`),

  delete: (id: string): Promise<void> => apiClient.delete(`/rentals/${id}`),
};
