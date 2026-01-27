import { z } from 'zod';
import { validatePlate } from '../utils/document.util';

export const createVehicleSchema = z.object({
  plate: z.string().refine(
    (plate) => validatePlate(plate),
    { message: 'Placa inválida' }
  ),
  brand: z.string().min(2).max(50),
  model: z.string().min(2).max(50),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().min(3).max(30),
  registrationNumber: z.string().min(5).max(20),
  chassis: z.string().length(17, 'Chassi deve ter 17 caracteres'),
  dailyRate: z.number().positive('Valor diário deve ser positivo'),
  mileage: z.number().int().min(0).default(0),
  fuelType: z.enum(['GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC', 'HYBRID']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  category: z.enum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY']),
  capacity: z.number().int().min(2).max(50).default(5),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE']).optional(),
});

export const filterVehicleSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  category: z.enum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY']).optional(),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE']).optional(),
  minDailyRate: z.number().optional(),
  maxDailyRate: z.number().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type FilterVehicleInput = z.infer<typeof filterVehicleSchema>;
