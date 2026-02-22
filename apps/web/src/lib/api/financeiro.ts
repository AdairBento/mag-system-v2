import { apiClient } from './http';
import type { Invoice, Transaction, FinancialSummary, PaginatedResponse } from '@/types/financeiro';

export interface InvoiceFilters {
  clientId?: string;
  rentalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  invoiceId?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export const financeiroApi = {
  // ── Invoices ──────────────────────────────────────────────────────────────
  listInvoices: (filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> => {
    const p = new URLSearchParams();
    if (filters?.clientId) p.set('clientId', filters.clientId);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Invoice>>(`/financeiro/invoices?${p}`);
  },

  getInvoice: (id: string): Promise<Invoice> =>
    apiClient.get<Invoice>(`/financeiro/invoices/${id}`),

  createInvoice: (data: Partial<Invoice>): Promise<Invoice> =>
    apiClient.post<Invoice>('/financeiro/invoices', data),

  updateInvoice: (id: string, data: Partial<Invoice>): Promise<Invoice> =>
    apiClient.put<Invoice>(`/financeiro/invoices/${id}`, data),

  deleteInvoice: (id: string): Promise<void> => apiClient.delete(`/financeiro/invoices/${id}`),

  // ── Transactions ──────────────────────────────────────────────────────────
  listTransactions: (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const p = new URLSearchParams();
    if (filters?.type) p.set('type', filters.type);
    if (filters?.status) p.set('status', filters.status);
    if (filters?.startDate) p.set('startDate', filters.startDate);
    if (filters?.endDate) p.set('endDate', filters.endDate);
    if (filters?.skip != null) p.set('skip', String(filters.skip));
    if (filters?.take != null) p.set('take', String(filters.take));
    return apiClient.get<PaginatedResponse<Transaction>>(`/financeiro/transactions?${p}`);
  },

  getTransaction: (id: string): Promise<Transaction> =>
    apiClient.get<Transaction>(`/financeiro/transactions/${id}`),

  createTransaction: (data: Partial<Transaction>): Promise<Transaction> =>
    apiClient.post<Transaction>('/financeiro/transactions', data),

  updateTransaction: (id: string, data: Partial<Transaction>): Promise<Transaction> =>
    apiClient.put<Transaction>(`/financeiro/transactions/${id}`, data),

  deleteTransaction: (id: string): Promise<void> =>
    apiClient.delete(`/financeiro/transactions/${id}`),

  // ── Summary ───────────────────────────────────────────────────────────────
  getSummary: (): Promise<FinancialSummary> =>
    apiClient.get<FinancialSummary>('/financeiro/summary'),
};
