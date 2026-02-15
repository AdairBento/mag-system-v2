/**
 * Vehicle domain types
 * Tipos relacionados ao domínio de veículos
 */

export type VehicleStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
export type VehicleCategory = 'ECONOMIC' | 'INTERMEDIATE' | 'EXECUTIVE' | 'SUV';

// Filtros (incluindo "all")
export type VehicleStatusFilter = 'all' | VehicleStatus;
export type VehicleCategoryFilter = 'all' | VehicleCategory;

// Tipos completos (para uso em forms, APIs, etc)
export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  category: VehicleCategory;
  // ... outros campos
}
