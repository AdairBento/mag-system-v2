import { z } from 'zod';
import { validateCPF } from '../utils/document.util';

export const createDriverSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
  document: z.string().refine(
    (cpf) => validateCPF(cpf.replace(/\D/g, '')),
    { message: 'CPF inválido' }
  ),
  licenseNumber: z.string().regex(/^\d{11}$/, 'CNH deve ter 11 dígitos'),
  licenseCategory: z.enum(['A', 'B', 'AB', 'C', 'D', 'E']),
  licenseExpiresAt: z.coerce.date().refine(
    (date) => date > new Date(),
    { message: 'CNH vencida ou inválida' }
  ),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
});

export const updateDriverSchema = createDriverSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const filterDriverSchema = z.object({
  name: z.string().optional(),
  document: z.string().optional(),
  licenseNumber: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type FilterDriverInput = z.infer<typeof filterDriverSchema>;
