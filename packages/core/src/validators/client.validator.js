"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterClientSchema = exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
const document_util_1 = require("../utils/document.util");
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
    email: zod_1.z.string().email('Email inválido'),
    phone: zod_1.z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
    document: zod_1.z.string().refine((doc) => {
        const cleaned = doc.replace(/\D/g, '');
        return cleaned.length === 11 ? (0, document_util_1.validateCPF)(cleaned) : (0, document_util_1.validateCNPJ)(cleaned);
    }, { message: 'CPF ou CNPJ inválido' }),
    documentType: zod_1.z.enum(['CPF', 'CNPJ']),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().length(2).optional(),
    zipCode: zod_1.z.string().regex(/^\d{5}-?\d{3}$/).optional(),
});
exports.updateClientSchema = exports.createClientSchema.partial().extend({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
});
exports.filterClientSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    document: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=client.validator.js.map