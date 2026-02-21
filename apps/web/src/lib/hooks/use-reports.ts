import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports';

export function useDashboard() {
  return useQuery({
    queryKey: ['reports-dashboard'],
    queryFn: () => reportsApi.getDashboard(),
    staleTime: 30_000,
  });
}

export function useRentalReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['reports-rentals', startDate, endDate],
    queryFn: () => reportsApi.getRentals(startDate, endDate),
  });
}

export function useFleetReport() {
  return useQuery({
    queryKey: ['reports-fleet'],
    queryFn: () => reportsApi.getFleet(),
  });
}

export function useFinancialReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['reports-financial', startDate, endDate],
    queryFn: () => reportsApi.getFinancial(startDate, endDate),
  });
}
