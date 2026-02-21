export type InsuranceStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Seguro {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  amount: number | string;
  coverageType: string;
  status: InsuranceStatus;
  createdAt?: string;
  updatedAt?: string;
  vehicle?: { id: string; plate?: string; brand: string; model: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
