export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export enum VehicleCategory {
  ECONOMIC = 'ECONOMIC',
  INTERMEDIATE = 'INTERMEDIATE',
  EXECUTIVE = 'EXECUTIVE',
  SUV = 'SUV',
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  ETHANOL = 'ETHANOL',
  FLEX = 'FLEX',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export interface Vehicle {
  id: string;
  plate: string;
  registrationNumber: string; // Renavam
  chassis: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  category: VehicleCategory;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  km: number;
  dailyRate: number;
  status: VehicleStatus;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleFilters {
  search?: string;
  status?: VehicleStatus;
  category?: VehicleCategory;
  page?: number;
  limit?: number;
}

export interface VehiclesResponse {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

export type CreateVehicleDto = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVehicleDto = Partial<CreateVehicleDto>;
