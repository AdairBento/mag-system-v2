export type RentalStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Locacao {
  id: string;
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  expectedEndDate: string;
  returnedAt: string | null;
  dailyRate: number | string;
  totalDays: number;
  totalAmount: number | string;
  deposit: number | string;
  discount: number | string;
  status: RentalStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
