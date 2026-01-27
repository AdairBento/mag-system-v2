export declare const RENTAL_RULES: {
    readonly MIN_RENTAL_DAYS: 1;
    readonly MAX_RENTAL_DAYS: 365;
    readonly DEFAULT_DEPOSIT: 500;
    readonly DISCOUNT_THRESHOLD_DAYS: 7;
    readonly DISCOUNT_PERCENTAGE: 10;
    readonly MAX_ADVANCE_BOOKING_DAYS: 180;
};
export declare const MAINTENANCE_THRESHOLDS: {
    readonly OIL_CHANGE: 10000;
    readonly TIRE_ROTATION: 15000;
    readonly GENERAL_INSPECTION: 20000;
    readonly BRAKE_CHECK: 30000;
};
export declare const DEPOSIT_BY_CATEGORY: {
    readonly COMPACT: 300;
    readonly SEDAN: 500;
    readonly SUV: 800;
    readonly PICKUP: 1000;
    readonly VAN: 1200;
    readonly LUXURY: 2000;
};
export declare const ENTITY_STATUS: {
    readonly CLIENT: readonly ["ACTIVE", "INACTIVE", "BLOCKED"];
    readonly DRIVER: readonly ["ACTIVE", "INACTIVE", "SUSPENDED"];
    readonly VEHICLE: readonly ["AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"];
    readonly RENTAL: readonly ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"];
};
export declare const DOCUMENT_PATTERNS: {
    readonly CPF: RegExp;
    readonly CNPJ: RegExp;
    readonly CPF_FORMATTED: RegExp;
    readonly CNPJ_FORMATTED: RegExp;
    readonly PLATE: RegExp;
    readonly LICENSE_NUMBER: RegExp;
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_CPF: "CPF inválido";
    readonly INVALID_CNPJ: "CNPJ inválido";
    readonly INVALID_EMAIL: "Email inválido";
    readonly INVALID_PHONE: "Telefone inválido";
    readonly INVALID_PLATE: "Placa inválida";
    readonly CLIENT_NOT_FOUND: "Cliente não encontrado";
    readonly CLIENT_ALREADY_EXISTS: "Cliente já cadastrado";
    readonly CLIENT_BLOCKED: "Cliente bloqueado";
    readonly DRIVER_NOT_FOUND: "Motorista não encontrado";
    readonly DRIVER_LICENSE_EXPIRED: "CNH vencida";
    readonly DRIVER_SUSPENDED: "Motorista suspenso";
    readonly VEHICLE_NOT_FOUND: "Veículo não encontrado";
    readonly VEHICLE_NOT_AVAILABLE: "Veículo indisponível";
    readonly VEHICLE_IN_MAINTENANCE: "Veículo em manutenção";
    readonly RENTAL_NOT_FOUND: "Locação não encontrada";
    readonly RENTAL_DATES_INVALID: "Datas de locação inválidas";
    readonly RENTAL_OVERLAPPING: "Período já reservado";
};
//# sourceMappingURL=index.d.ts.map