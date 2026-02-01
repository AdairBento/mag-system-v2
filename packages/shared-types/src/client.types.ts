export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
