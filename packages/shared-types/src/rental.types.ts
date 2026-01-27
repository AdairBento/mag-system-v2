export interface Rental {
  id: string;
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  returnDate: Date | null;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  status: RentalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum RentalStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CreateRentalPayload {
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  dailyRate: number;
}

export interface UpdateRentalPayload extends Partial<CreateRentalPayload> {
  returnDate?: Date;
  status?: RentalStatus;
}
