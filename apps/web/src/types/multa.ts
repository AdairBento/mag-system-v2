export type FineStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CONTESTED';

export interface Multa {
  id: string;
  vehicleId: string;
  driverId?: string | null;
  date: string;
  location: string;
  description: string;
  amount: number | string;
  dueDate: string;
  paidDate?: string | null;
  status: FineStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  vehicle?: { id: string; plate?: string; brand: string; model: string };
  driver?: { id: string; name: string } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
