export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type LicenseCategory = 'A' | 'B' | 'AB' | 'C' | 'D' | 'E' | 'AC' | 'AD' | 'AE';

export interface Motorista {
  id: string;
  clientId: string | null;
  name: string;
  email: string | null;
  phone: string;
  document: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiresAt: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
