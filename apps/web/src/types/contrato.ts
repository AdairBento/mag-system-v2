export type ContractStatus = 'PENDING' | 'SIGNED' | 'CANCELLED';

export interface Contract {
  id: string;
  rentalId: string;
  fileUrl: string;
  signedAt?: string | null;
  signedBy?: string | null;
  status: ContractStatus;
  createdAt?: string;
  updatedAt?: string;
  rental?: {
    id: string;
    client?: { id: string; name: string };
    vehicle?: { id: string; plate?: string; brand: string; model: string };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
