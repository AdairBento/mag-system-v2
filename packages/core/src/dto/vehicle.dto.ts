/**
 * DTOs para módulo de Veículos
 */

export interface CreateVehicleDto {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassis: string;
  dailyRate: number;
  mileage?: number;
  fuelType: 'GASOLINE' | 'ETHANOL' | 'DIESEL' | 'FLEX' | 'ELECTRIC' | 'HYBRID';
  transmission: 'MANUAL' | 'AUTOMATIC';
  category: 'COMPACT' | 'SEDAN' | 'SUV' | 'PICKUP' | 'VAN' | 'LUXURY';
  capacity?: number;
}

export interface UpdateVehicleDto {
  plate?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  registrationNumber?: string;
  chassis?: string;
  dailyRate?: number;
  mileage?: number;
  fuelType?: 'GASOLINE' | 'ETHANOL' | 'DIESEL' | 'FLEX' | 'ELECTRIC' | 'HYBRID';
  transmission?: 'MANUAL' | 'AUTOMATIC';
  category?: 'COMPACT' | 'SEDAN' | 'SUV' | 'PICKUP' | 'VAN' | 'LUXURY';
  capacity?: number;
  status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
}

export interface VehicleResponseDto {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassis: string;
  dailyRate: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  category: string;
  capacity: number;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterVehicleDto {
  brand?: string;
  model?: string;
  category?: 'COMPACT' | 'SEDAN' | 'SUV' | 'PICKUP' | 'VAN' | 'LUXURY';
  status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
  minDailyRate?: number;
  maxDailyRate?: number;
  page?: number;
  limit?: number;
}

export interface VehicleStatsDto {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  inactive: number;
}
