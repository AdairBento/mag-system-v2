export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  transmissionType: string;
  category: string;
  dailyRate: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
