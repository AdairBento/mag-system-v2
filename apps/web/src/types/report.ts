export interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  activeRentals: number;
  pendingInvoices: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface RentalReport {
  byStatus: StatusCount[];
  totalRevenue: number | string;
}

export interface FleetReport {
  byStatus: StatusCount[];
  avgDailyRate: number | string;
}

export interface FinancialReport {
  totalIncome: number | string;
  totalExpense: number | string;
  net: number | string;
}
