"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterVehicleSchema = exports.updateVehicleSchema = exports.createVehicleSchema = void 0;
const zod_1 = require("zod");
const document_util_1 = require("../utils/document.util");
exports.createVehicleSchema = zod_1.z.object({
    plate: zod_1.z.string().refine((plate) => (0, document_util_1.validatePlate)(plate), { message: 'Placa inválida' }),
    brand: zod_1.z.string().min(2).max(50),
    model: zod_1.z.string().min(2).max(50),
    year: zod_1.z.number().int().min(1990).max(new Date().getFullYear() + 1),
    color: zod_1.z.string().min(3).max(30),
    registrationNumber: zod_1.z.string().min(5).max(20),
    chassis: zod_1.z.string().length(17, 'Chassi deve ter 17 caracteres'),
    dailyRate: zod_1.z.number().positive('Valor diário deve ser positivo'),
    mileage: zod_1.z.number().int().min(0).default(0),
    fuelType: zod_1.z.enum(['GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC', 'HYBRID']),
    transmission: zod_1.z.enum(['MANUAL', 'AUTOMATIC']),
    category: zod_1.z.enum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY']),
    capacity: zod_1.z.number().int().min(2).max(50).default(5),
});
exports.updateVehicleSchema = exports.createVehicleSchema.partial().extend({
    status: zod_1.z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE']).optional(),
});
exports.filterVehicleSchema = zod_1.z.object({
    brand: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    category: zod_1.z.enum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY']).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE']).optional(),
    minDailyRate: zod_1.z.number().optional(),
    maxDailyRate: zod_1.z.number().optional(),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=vehicle.validator.js.map