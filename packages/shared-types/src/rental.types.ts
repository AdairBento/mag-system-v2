export interface Rental {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}
