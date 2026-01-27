"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDriverSchema = exports.updateDriverSchema = exports.createDriverSchema = void 0;
const zod_1 = require("zod");
const document_util_1 = require("../utils/document.util");
exports.createDriverSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    email: zod_1.z.string().email('Email inválido'),
    phone: zod_1.z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
    document: zod_1.z.string().refine((cpf) => (0, document_util_1.validateCPF)(cpf.replace(/\D/g, '')), { message: 'CPF inválido' }),
    licenseNumber: zod_1.z.string().regex(/^\d{11}$/, 'CNH deve ter 11 dígitos'),
    licenseCategory: zod_1.z.enum(['A', 'B', 'AB', 'C', 'D', 'E']),
    licenseExpiresAt: zod_1.z.coerce.date().refine((date) => date > new Date(), { message: 'CNH vencida ou inválida' }),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().length(2).optional(),
    zipCode: zod_1.z.string().regex(/^\d{5}-?\d{3}$/).optional(),
});
exports.updateDriverSchema = exports.createDriverSchema.partial().extend({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});
exports.filterDriverSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    document: zod_1.z.string().optional(),
    licenseNumber: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=driver.validator.js.map