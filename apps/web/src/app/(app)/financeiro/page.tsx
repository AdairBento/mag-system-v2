'use client';

import { useState } from 'react';
import {
  useInvoices,
  useTransactions,
  useFinanceiroSummary,
  useDeleteInvoice,
} from '@/lib/hooks/use-financeiro';
import type { InvoiceStatus } from '@/types/financeiro';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
  COMPLETED: 'bg-green-100 text-green-800',
  INCOME: 'bg-blue-100 text-blue-800',
  EXPENSE: 'bg-red-100 text-red-800',
};

function Badge({ value }: { value: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[value] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {value}
    </span>
  );
}

function fmt(v: number | string | undefined) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FinanceiroPage() {
  const [tab, setTab] = useState<'invoices' | 'transactions'>('invoices');
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [invoicePage, setInvoicePage] = useState(0);
  const PAGE = 10;

  const summary = useFinanceiroSummary();
  const invoices = useInvoices({
    status: invoiceStatus || undefined,
    skip: invoicePage * PAGE,
    take: PAGE,
  });
  const transactions = useTransactions({ skip: 0, take: 20 });
  const deleteInvoice = useDeleteInvoice();

  const invoiceList = invoices.data?.data ?? [];
  const invoiceTotal = invoices.data?.total ?? 0;
  const txList = transactions.data?.data ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Financeiro</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Receitas', value: fmt(summary.data?.totalIncome), color: 'text-green-600' },
          { label: 'Despesas', value: fmt(summary.data?.totalExpense), color: 'text-red-600' },
          { label: 'Saldo', value: fmt(summary.data?.balance), color: 'text-blue-600' },
          {
            label: 'Fat. Pendentes',
            value: summary.data?.pendingInvoices ?? '—',
            color: 'text-yellow-600',
          },
        ].map((c) => (
          <div key={c.label} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{summary.isLoading ? '…' : c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['invoices', 'transactions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-medium ${tab === t ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
          >
            {t === 'invoices' ? 'Faturas' : 'Transações'}
          </button>
        ))}
      </div>

      {tab === 'invoices' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <select
              value={invoiceStatus}
              onChange={(e) => {
                setInvoiceStatus(e.target.value);
                setInvoicePage(0);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Todos status</option>
              {(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'] as InvoiceStatus[]).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500 ml-auto">{invoiceTotal} faturas</span>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Nº', 'Cliente', 'Valor', 'Vencimento', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : invoiceList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhuma fatura encontrada
                  </td>
                </tr>
              ) : (
                invoiceList.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">{inv.client?.name ?? inv.clientId.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-medium">{fmt(inv.amount)}</td>
                    <td className="px-4 py-3">
                      {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteInvoice.mutate(inv.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {invoiceTotal > PAGE && (
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <button
                disabled={invoicePage === 0}
                onClick={() => setInvoicePage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Anterior
              </button>
              <span>
                Página {invoicePage + 1} de {Math.ceil(invoiceTotal / PAGE)}
              </span>
              <button
                disabled={(invoicePage + 1) * PAGE >= invoiceTotal}
                onClick={() => setInvoicePage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'transactions' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Tipo', 'Categoria', 'Valor', 'Data', 'Método', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : txList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhuma transação
                  </td>
                </tr>
              ) : (
                txList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Badge value={tx.type} />
                    </td>
                    <td className="px-4 py-3">{tx.category}</td>
                    <td className="px-4 py-3 font-medium">{fmt(tx.amount)}</td>
                    <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{tx.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <Badge value={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
