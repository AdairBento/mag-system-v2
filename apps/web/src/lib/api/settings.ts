import { apiClient } from './http';
import type { Setting, PaginatedResponse } from '@/types/setting';

export const settingsApi = {
  list: (search?: string): Promise<PaginatedResponse<Setting>> => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    return apiClient.get<PaginatedResponse<Setting>>(`/settings?${p}`);
  },

  getByKey: (key: string): Promise<Setting> => apiClient.get<Setting>(`/settings/key/${key}`),

  upsertByKey: (key: string, value: string, type?: string): Promise<Setting> =>
    apiClient.put<Setting>(`/settings/key/${key}`, { value, type }),

  create: (data: Partial<Setting>): Promise<Setting> => apiClient.post<Setting>('/settings', data),

  update: (id: string, data: Partial<Setting>): Promise<Setting> =>
    apiClient.put<Setting>(`/settings/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/settings/${id}`),
};
