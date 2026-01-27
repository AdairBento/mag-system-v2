export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassis: string;
  dailyRate: number;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface CreateVehiclePayload {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassis: string;
  dailyRate: number;
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {
  status?: VehicleStatus;
}
