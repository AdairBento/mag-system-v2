import { apiClient } from './http';
import type { Notification, PaginatedResponse } from '@/types/notificacao';

export interface NotificationFilters {
  userId?: string;
  resource?: string;
  action?: string;
  skip?: number;
  take?: number;
}

export const notificacoesApi = {
  list: (filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> => {
    const p = new URLSearchParams();
    if (filters?.userId) p.set('userId', filters.userId);
    if (filters?.resource) p.set('resource', filters.resource);
    if (filters?.action) p.set('action', filters.action);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications?${p}`);
  },

  recent: (): Promise<Notification[]> => apiClient.get<Notification[]>('/notifications/recent'),
};
