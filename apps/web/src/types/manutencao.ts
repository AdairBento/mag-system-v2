export type MaintenanceType =
  | 'PREVENTIVE'
  | 'CORRECTIVE'
  | 'INSPECTION'
  | 'TIRE_CHANGE'
  | 'OIL_CHANGE'
  | 'OTHER';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  completedDate?: string | null;
  cost?: number | string | null;
  mileage?: number | null;
  status: MaintenanceStatus;
  notes?: string | null;
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
