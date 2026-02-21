export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  amount: number | string;
  dueDate: string;
  paidDate?: string | null;
  description: string;
  status: InvoiceStatus;
  rentalId?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  client?: { id: string; name: string };
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number | string;
  date: string;
  paymentMethod: string;
  description: string;
  status: TransactionStatus;
  invoiceId?: string | null;
  reference?: string | null;
  createdAt?: string;
}

export interface FinanceiroSummary {
  totalIncome: number | string;
  totalExpense: number | string;
  balance: number | string;
  pendingInvoices: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
