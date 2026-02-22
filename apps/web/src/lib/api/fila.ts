import { apiClient } from './http';
import type { Job, JobStatus } from '@/types/fila';

export const filaApi = {
  list: (status?: JobStatus): Promise<Job[]> => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    return apiClient.get<Job[]>(`/queue/jobs?${p}`);
  },

  getJob: (id: string): Promise<Job> => apiClient.get<Job>(`/queue/jobs/${id}`),

  enqueue: (data: {
    name: string;
    payload?: Record<string, unknown>;
    priority?: string;
    delay?: number;
    retries?: number;
  }): Promise<Job> => apiClient.post<Job>('/queue/jobs', data),

  process: (id: string): Promise<Job> => apiClient.post<Job>(`/queue/jobs/${id}/process`, {}),

  cancel: (id: string): Promise<Job> => apiClient.delete<Job>(`/queue/jobs/${id}`),
};
