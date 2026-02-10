export type CNHCategory = "A" | "B" | "AB" | "C" | "D" | "E" | "AC" | "AD" | "AE";
export type DriverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Driver {
  id?: string;
  clientId?: string;
  clientName?: string; // Campo virtual retornado pela API
  name: string;
  email: string; // ✅ Obrigatório (alinhado com backend)
  phone: string;
  document: string; // CPF
  licenseNumber: string; // CNH
  licenseCategory: CNHCategory | null;
  licenseExpiresAt: string; // Data de validade da CNH
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: DriverStatus;
  createdAt?: string;
  updatedAt?: string;
}
