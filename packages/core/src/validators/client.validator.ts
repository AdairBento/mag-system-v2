import { z } from 'zod';
import { validateCPF, validateCNPJ } from '../utils/document.util';

export const createClientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
  document: z.string().refine(
    (doc) => {
      const cleaned = doc.replace(/\D/g, '');
      return cleaned.length === 11 ? validateCPF(cleaned) : validateCNPJ(cleaned);
    },
    { message: 'CPF ou CNPJ inválido' }
  ),
  documentType: z.enum(['CPF', 'CNPJ']),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
});

export const updateClientSchema = createClientSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
});

export const filterClientSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  document: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type FilterClientInput = z.infer<typeof filterClientSchema>;
