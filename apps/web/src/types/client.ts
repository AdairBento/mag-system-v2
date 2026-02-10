export type ClientType = "CPF" | "CNPJ";
export type ClientStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: ClientType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: ClientStatus;
  createdAt?: string;
  updatedAt?: string;
}
