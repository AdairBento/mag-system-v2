import { z } from 'zod';
import { isValidRentalPeriod } from '../utils/date.util';
import { RENTAL_RULES } from '../constants';

const baseRentalSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  driverId: z.string().uuid('ID do motorista inválido'),
  vehicleId: z.string().uuid('ID do veículo inválido'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  dailyRate: z.number().positive('Valor diário deve ser positivo'),
  deposit: z.number().min(0).default(RENTAL_RULES.DEFAULT_DEPOSIT),
  discount: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

export const createRentalSchema = baseRentalSchema.refine(
  (data) => isValidRentalPeriod(data.startDate, data.endDate),
  { message: 'Período de locação inválido', path: ['endDate'] }
).refine(
  (data) => {
    const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days >= RENTAL_RULES.MIN_RENTAL_DAYS && days <= RENTAL_RULES.MAX_RENTAL_DAYS;
  },
  { message: `Período deve estar entre ${RENTAL_RULES.MIN_RENTAL_DAYS} e ${RENTAL_RULES.MAX_RENTAL_DAYS} dias` }
);

export const updateRentalSchema = baseRentalSchema.partial().extend({
  returnDate: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

export const filterRentalSchema = z.object({
  clientId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type UpdateRentalInput = z.infer<typeof updateRentalSchema>;
export type FilterRentalInput = z.infer<typeof filterRentalSchema>;
