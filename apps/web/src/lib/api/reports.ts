import { apiClient } from './http';
import type { DashboardStats, RentalReport, FleetReport, FinancialReport } from '@/types/report';

export const reportsApi = {
  getDashboard: (): Promise<DashboardStats> => apiClient.get<DashboardStats>('/reports/dashboard'),

  getRentals: (startDate?: string, endDate?: string): Promise<RentalReport> => {
    const p = new URLSearchParams();
    if (startDate) p.set('startDate', startDate);
    if (endDate) p.set('endDate', endDate);
    return apiClient.get<RentalReport>(`/reports/rentals?${p}`);
  },

  getFleet: (): Promise<FleetReport> => apiClient.get<FleetReport>('/reports/fleet'),

  getFinancial: (startDate?: string, endDate?: string): Promise<FinancialReport> => {
    const p = new URLSearchParams();
    if (startDate) p.set('startDate', startDate);
    if (endDate) p.set('endDate', endDate);
    return apiClient.get<FinancialReport>(`/reports/financial?${p}`);
  },
};
