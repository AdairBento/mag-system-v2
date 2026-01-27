/**
 * Regras de negócio para locações
 */
export const RENTAL_RULES = {
  MIN_RENTAL_DAYS: 1,
  MAX_RENTAL_DAYS: 365,
  DEFAULT_DEPOSIT: 500,
  DISCOUNT_THRESHOLD_DAYS: 7,
  DISCOUNT_PERCENTAGE: 10,
  MAX_ADVANCE_BOOKING_DAYS: 180,
} as const;

/**
 * Limites de quilometragem para manutenção
 */
export const MAINTENANCE_THRESHOLDS = {
  OIL_CHANGE: 10000, // km
  TIRE_ROTATION: 15000,
  GENERAL_INSPECTION: 20000,
  BRAKE_CHECK: 30000,
} as const;

/**
 * Valores de depósito por categoria de veículo
 */
export const DEPOSIT_BY_CATEGORY = {
  COMPACT: 300,
  SEDAN: 500,
  SUV: 800,
  PICKUP: 1000,
  VAN: 1200,
  LUXURY: 2000,
} as const;

/**
 * Status válidos para cada entidade
 */
export const ENTITY_STATUS = {
  CLIENT: ['ACTIVE', 'INACTIVE', 'BLOCKED'] as const,
  DRIVER: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const,
  VEHICLE: ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'] as const,
  RENTAL: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const,
} as const;

/**
 * Formatos de documento
 */
export const DOCUMENT_PATTERNS = {
  CPF: /^\d{11}$/,
  CNPJ: /^\d{14}$/,
  CPF_FORMATTED: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ_FORMATTED: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  PLATE: /^[A-Z]{3}\d[A-Z0-9]\d{2}$/,
  LICENSE_NUMBER: /^\d{11}$/,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  // Validação
  INVALID_CPF: 'CPF inválido',
  INVALID_CNPJ: 'CNPJ inválido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_PLATE: 'Placa inválida',
  
  // Cliente
  CLIENT_NOT_FOUND: 'Cliente não encontrado',
  CLIENT_ALREADY_EXISTS: 'Cliente já cadastrado',
  CLIENT_BLOCKED: 'Cliente bloqueado',
  
  // Motorista
  DRIVER_NOT_FOUND: 'Motorista não encontrado',
  DRIVER_LICENSE_EXPIRED: 'CNH vencida',
  DRIVER_SUSPENDED: 'Motorista suspenso',
  
  // Veículo
  VEHICLE_NOT_FOUND: 'Veículo não encontrado',
  VEHICLE_NOT_AVAILABLE: 'Veículo indisponível',
  VEHICLE_IN_MAINTENANCE: 'Veículo em manutenção',
  
  // Locação
  RENTAL_NOT_FOUND: 'Locação não encontrada',
  RENTAL_DATES_INVALID: 'Datas de locação inválidas',
  RENTAL_OVERLAPPING: 'Período já reservado',
} as const;
