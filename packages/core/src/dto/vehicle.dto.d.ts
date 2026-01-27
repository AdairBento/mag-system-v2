export declare class CreateVehicleDto {
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    chassis: string;
    dailyRate: number;
    mileage?: number;
    fuelType: 'GASOLINE' | 'ETHANOL' | 'DIESEL' | 'FLEX' | 'ELECTRIC' | 'HYBRID';
    transmission: 'MANUAL' | 'AUTOMATIC';
    category: 'COMPACT' | 'SEDAN' | 'SUV' | 'PICKUP' | 'VAN' | 'LUXURY';
    capacity?: number;
}
export declare class UpdateVehicleDto {
    plate?: string;
    brand?: string;
    model?: string;
    year?: number;
    color?: string;
    registrationNumber?: string;
    chassis?: string;
    dailyRate?: number;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    category?: string;
    capacity?: number;
    status?: string;
}
export interface VehicleResponseDto {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    chassis: string;
    dailyRate: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    category: string;
    capacity: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class FilterVehicleDto {
    brand?: string;
    model?: string;
    category?: string;
    status?: string;
    minDailyRate?: number;
    maxDailyRate?: number;
    page?: number;
    limit?: number;
}
export interface VehicleStatsDto {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    inactive: number;
}
//# sourceMappingURL=vehicle.dto.d.ts.map