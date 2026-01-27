export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiresAt: Date;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum LicenseCategory {
  A = 'A',
  B = 'B',
  AB = 'AB',
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone: string;
  document: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiresAt: Date;
}

export interface UpdateDriverPayload extends Partial<CreateDriverPayload> {
  status?: DriverStatus;
}
