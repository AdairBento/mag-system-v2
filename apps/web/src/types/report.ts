export interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  activeRentals: number;
  pendingInvoices: number;
}

export interface RentalReport {
  byStatus: Record<string, number>;
  totalRevenue: number | string;
}

export interface FleetReport {
  byStatus: Record<string, number>;
  avgDailyRate: number | string;
}

export interface FinancialReport {
  totalIncome: number | string;
  totalExpense: number | string;
  balance: number | string;
}
