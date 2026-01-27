export declare class CreateDriverDto {
    name: string;
    email: string;
    phone: string;
    document: string;
    licenseNumber: string;
    licenseCategory: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
    licenseExpiresAt: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}
export declare class UpdateDriverDto {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    licenseNumber?: string;
    licenseCategory?: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
    licenseExpiresAt?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
export interface DriverResponseDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    licenseNumber: string;
    licenseCategory: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
    licenseExpiresAt: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class FilterDriverDto {
    name?: string;
    document?: string;
    licenseNumber?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    page?: number;
    limit?: number;
}
//# sourceMappingURL=driver.dto.d.ts.map