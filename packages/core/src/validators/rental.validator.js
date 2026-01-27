"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRentalSchema = exports.updateRentalSchema = exports.createRentalSchema = void 0;
const zod_1 = require("zod");
const date_util_1 = require("../utils/date.util");
const constants_1 = require("../constants");
const baseRentalSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid('ID do cliente inválido'),
    driverId: zod_1.z.string().uuid('ID do motorista inválido'),
    vehicleId: zod_1.z.string().uuid('ID do veículo inválido'),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    dailyRate: zod_1.z.number().positive('Valor diário deve ser positivo'),
    deposit: zod_1.z.number().min(0).default(constants_1.RENTAL_RULES.DEFAULT_DEPOSIT),
    discount: zod_1.z.number().min(0).max(100).default(0),
    notes: zod_1.z.string().optional(),
});
exports.createRentalSchema = baseRentalSchema.refine((data) => (0, date_util_1.isValidRentalPeriod)(data.startDate, data.endDate), { message: 'Período de locação inválido', path: ['endDate'] }).refine((data) => {
    const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days >= constants_1.RENTAL_RULES.MIN_RENTAL_DAYS && days <= constants_1.RENTAL_RULES.MAX_RENTAL_DAYS;
}, { message: `Período deve estar entre ${constants_1.RENTAL_RULES.MIN_RENTAL_DAYS} e ${constants_1.RENTAL_RULES.MAX_RENTAL_DAYS} dias` });
exports.updateRentalSchema = baseRentalSchema.partial().extend({
    returnDate: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});
exports.filterRentalSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    driverId: zod_1.z.string().uuid().optional(),
    vehicleId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=rental.validator.js.map