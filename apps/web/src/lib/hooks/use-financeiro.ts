import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { financeiroApi, type InvoiceFilters, type TransactionFilters } from '@/lib/api/financeiro';
import type { Invoice, Transaction } from '@/types/financeiro';

const INVOICE_KEY = 'invoices';
const TRANSACTION_KEY = 'transactions';
const SUMMARY_KEY = 'financeiro-summary';

export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: [INVOICE_KEY, filters],
    queryFn: () => financeiroApi.listInvoices(filters),
  });
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: [TRANSACTION_KEY, filters],
    queryFn: () => financeiroApi.listTransactions(filters),
  });
}

export function useFinanceiroSummary() {
  return useQuery({
    queryKey: [SUMMARY_KEY],
    queryFn: () => financeiroApi.getSummary(),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Invoice>) => financeiroApi.createInvoice(data),
    onSuccess: () => {
      toast.success('Fatura criada!');
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao criar fatura'),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) =>
      financeiroApi.updateInvoice(id, data),
    onSuccess: () => {
      toast.success('Fatura atualizada!');
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar fatura'),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeiroApi.deleteInvoice(id),
    onSuccess: () => {
      toast.success('Fatura removida!');
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao remover fatura'),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => financeiroApi.createTransaction(data),
    onSuccess: () => {
      toast.success('Transação registrada!');
      queryClient.invalidateQueries({ queryKey: [TRANSACTION_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
    onError: () => toast.error('Erro ao registrar transação'),
  });
}
