export type DamageSeverity = 'MINOR' | 'MODERATE' | 'SEVERE';

export interface Damage {
  id: string;
  inspectionId: string;
  description: string;
  severity: DamageSeverity;
  location: string;
  estimatedCost?: number | null;
  createdAt?: string;
}

export interface Photo {
  id: string;
  inspectionId: string;
  url: string;
  description?: string | null;
  createdAt?: string;
}

export interface InspectionSummary {
  damages: {
    count: number;
    totalCost: number;
    items: Damage[];
  };
  photos: {
    count: number;
  };
}
