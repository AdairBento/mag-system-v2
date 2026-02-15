// apps/web/src/types/vehicle.ts
// ============================================
// VEHICLE TYPE DEFINITIONS - SINGLE SOURCE OF TRUTH (WEB)
// - Compatível com UI atual (plate, ECONOMIC/INTERMEDIATE/EXECUTIVE etc.)
// - Também suporta shape novo (licensePlate, mileage etc.)
// ============================================

// ============================================
// ENUM-LIKE VALUES (para UI) + TYPES
// ============================================

export const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  RENTED: 'RENTED',
  MAINTENANCE: 'MAINTENANCE',
  INACTIVE: 'INACTIVE',
} as const;
export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus];

export const VehicleCategory = {
  // categorias "clássicas"
  HATCH: 'HATCH',
  SEDAN: 'SEDAN',
  SUV: 'SUV',
  PICKUP: 'PICKUP',
  VAN: 'VAN',
  LUXURY: 'LUXURY',
  OTHER: 'OTHER',

  // compat com UI antiga (form usa ECONOMIC/INTERMEDIATE/EXECUTIVE)
  ECONOMIC: 'ECONOMIC',
  INTERMEDIATE: 'INTERMEDIATE',
  EXECUTIVE: 'EXECUTIVE',
} as const;
export type VehicleCategory = (typeof VehicleCategory)[keyof typeof VehicleCategory];

export const FuelType = {
  GASOLINE: 'GASOLINE',
  ETHANOL: 'ETHANOL',
  FLEX: 'FLEX',
  DIESEL: 'DIESEL',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
} as const;
export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const Transmission = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  CVT: 'CVT',
} as const;
export type Transmission = (typeof Transmission)[keyof typeof Transmission];

// ============================================
// FILTERS (VALUES para selects) + TYPES
// ============================================

export const VehicleStatusFilter = {
  ALL: 'ALL',
  ...VehicleStatus,
} as const;
export type VehicleStatusFilter = (typeof VehicleStatusFilter)[keyof typeof VehicleStatusFilter];

export const VehicleCategoryFilter = {
  ALL: 'ALL',
  ...VehicleCategory,
} as const;
export type VehicleCategoryFilter =
  (typeof VehicleCategoryFilter)[keyof typeof VehicleCategoryFilter];

export interface VehicleFilters {
  // compat: alguns lugares usam search, outros q
  search?: string;
  q?: string;

  status?: VehicleStatusFilter | 'all';
  category?: VehicleCategoryFilter | 'all';

  page?: number;
  limit?: number;
  pageSize?: number;
}

// ============================================
// ENTITY (Vehicle)
// ============================================

export interface Vehicle {
  id: string;

  // Compat: UI antiga usa plate; shape novo usa licensePlate
  plate?: string;
  licensePlate?: string;

  brand: string;
  model: string;

  year?: number | null;
  color?: string | null;

  category?: VehicleCategory | null;
  status?: VehicleStatus | null;

  fuelType?: FuelType | null;
  transmission?: Transmission | null;

  dailyRate?: number | null;

  // Compat: UI pode usar km; novo usa mileage
  km?: number | null;
  mileage?: number | null;

  // Campos opcionais que hoje aparecem no form (pra zerar TS sem quebrar UI)
  registrationNumber?: string | null;
  chassis?: string | null;
  seats?: number | null;

  features?: string[];
  imageUrl?: string | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ============================================
// DTOs
// ============================================

export interface CreateVehicleDto {
  // preferencial
  licensePlate?: string;

  // compat (form antigo)
  plate?: string;

  brand?: string;
  model?: string;
  year?: number;
  color?: string;

  category?: VehicleCategory;
  status?: VehicleStatus;
  fuelType?: FuelType;
  transmission?: Transmission;

  dailyRate?: number;

  // compat: km/mileage
  km?: number;
  mileage?: number;

  registrationNumber?: string;
  chassis?: string;
  seats?: number;

  features?: string[];
  imageUrl?: string;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {
  id: string;
}

// ============================================
// API RESPONSES
// ============================================

export interface VehiclesResponse {
  // alguns lugares usam items, outros data
  items?: Vehicle[];
  data?: Vehicle[];

  total?: number;

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // compat com paginação simples
  page?: number;
  pageSize?: number;
}
