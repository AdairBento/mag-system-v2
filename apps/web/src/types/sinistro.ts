export type AccidentSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'TOTAL_LOSS';
export type AccidentStatus = 'REPORTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SETTLED';

export interface Sinistro {
  id: string;
  vehicleId: string;
  insuranceId?: string | null;
  date: string;
  location: string;
  description: string;
  severity: AccidentSeverity;
  estimatedCost?: number | string | null;
  claimNumber?: string | null;
  status: AccidentStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  vehicle?: { id: string; plate?: string; brand: string; model: string };
  documents?: { id: string; type: string; url: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
