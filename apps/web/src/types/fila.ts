export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface Job {
  id: string;
  name: string;
  payload: Record<string, unknown>;
  priority: JobPriority;
  delay: number;
  retries: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}
