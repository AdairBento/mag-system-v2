export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiresAt: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
