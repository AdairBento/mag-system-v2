"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.DOCUMENT_PATTERNS = exports.ENTITY_STATUS = exports.DEPOSIT_BY_CATEGORY = exports.MAINTENANCE_THRESHOLDS = exports.RENTAL_RULES = void 0;
exports.RENTAL_RULES = {
    MIN_RENTAL_DAYS: 1,
    MAX_RENTAL_DAYS: 365,
    DEFAULT_DEPOSIT: 500,
    DISCOUNT_THRESHOLD_DAYS: 7,
    DISCOUNT_PERCENTAGE: 10,
    MAX_ADVANCE_BOOKING_DAYS: 180,
};
exports.MAINTENANCE_THRESHOLDS = {
    OIL_CHANGE: 10000,
    TIRE_ROTATION: 15000,
    GENERAL_INSPECTION: 20000,
    BRAKE_CHECK: 30000,
};
exports.DEPOSIT_BY_CATEGORY = {
    COMPACT: 300,
    SEDAN: 500,
    SUV: 800,
    PICKUP: 1000,
    VAN: 1200,
    LUXURY: 2000,
};
exports.ENTITY_STATUS = {
    CLIENT: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
    DRIVER: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    VEHICLE: ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'],
    RENTAL: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
};
exports.DOCUMENT_PATTERNS = {
    CPF: /^\d{11}$/,
    CNPJ: /^\d{14}$/,
    CPF_FORMATTED: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ_FORMATTED: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    PLATE: /^[A-Z]{3}\d[A-Z0-9]\d{2}$/,
    LICENSE_NUMBER: /^\d{11}$/,
};
exports.ERROR_MESSAGES = {
    INVALID_CPF: 'CPF inválido',
    INVALID_CNPJ: 'CNPJ inválido',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_PLATE: 'Placa inválida',
    CLIENT_NOT_FOUND: 'Cliente não encontrado',
    CLIENT_ALREADY_EXISTS: 'Cliente já cadastrado',
    CLIENT_BLOCKED: 'Cliente bloqueado',
    DRIVER_NOT_FOUND: 'Motorista não encontrado',
    DRIVER_LICENSE_EXPIRED: 'CNH vencida',
    DRIVER_SUSPENDED: 'Motorista suspenso',
    VEHICLE_NOT_FOUND: 'Veículo não encontrado',
    VEHICLE_NOT_AVAILABLE: 'Veículo indisponível',
    VEHICLE_IN_MAINTENANCE: 'Veículo em manutenção',
    RENTAL_NOT_FOUND: 'Locação não encontrada',
    RENTAL_DATES_INVALID: 'Datas de locação inválidas',
    RENTAL_OVERLAPPING: 'Período já reservado',
};
//# sourceMappingURL=index.js.map