/**
 * DTOs para módulo de Locações
 */

export interface CreateRentalDto {
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  dailyRate: number;
  deposit?: number;
  discount?: number;
  notes?: string;
}

export interface UpdateRentalDto {
  clientId?: string;
  driverId?: string;
  vehicleId?: string;
  startDate?: Date;
  endDate?: Date;
  returnDate?: Date;
  dailyRate?: number;
  deposit?: number;
  discount?: number;
  notes?: string;
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface RentalResponseDto {
  id: string;
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  deposit: number;
  discount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterRentalDto {
  clientId?: string;
  driverId?: string;
  vehicleId?: string;
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface RentalStatsDto {
  total: number;
  pending: number;
  active: number;
  completed: number;
  cancelled: number;
}
