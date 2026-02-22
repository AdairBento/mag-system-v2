'use client';

import { useState } from 'react';
import {
  useInvoices,
  useTransactions,
  useFinanceiroSummary,
  useDeleteInvoice,
  useDeleteTransaction,
} from '@/lib/hooks/use-financeiro';
import type { InvoiceStatus, TransactionType } from '@/types/financeiro';

// ── Helpers ───────────────────────────────────────────────────────────────────

const BADGE_COLORS: Record<string, string> = {
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
      className={`px-2 py-0.5 rounded text-xs font-medium ${BADGE_COLORS[value] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {value}
    </span>
  );
}

function fmt(v?: number | string | null) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-1 text-sm text-gray-600">
      {label}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      />
    </label>
  );
}

const PAGE = 10;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FinanceiroPage() {
  const [tab, setTab] = useState<'invoices' | 'transactions' | 'summary'>('invoices');

  // Invoice filters
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [invoiceStart, setInvoiceStart] = useState('');
  const [invoiceEnd, setInvoiceEnd] = useState('');
  const [invoicePage, setInvoicePage] = useState(0);

  // Transaction filters
  const [txType, setTxType] = useState('');
  const [txStart, setTxStart] = useState('');
  const [txEnd, setTxEnd] = useState('');
  const [txPage, setTxPage] = useState(0);

  const summary = useFinanceiroSummary();

  const invoices = useInvoices({
    status: invoiceStatus || undefined,
    startDate: invoiceStart || undefined,
    endDate: invoiceEnd || undefined,
    skip: invoicePage * PAGE,
    take: PAGE,
  });

  const transactions = useTransactions({
    type: txType || undefined,
    startDate: txStart || undefined,
    endDate: txEnd || undefined,
    skip: txPage * PAGE,
    take: PAGE,
  });

  const deleteInvoice = useDeleteInvoice();
  const deleteTransaction = useDeleteTransaction();

  const invoiceList = invoices.data?.data ?? [];
  const invoiceTotal = invoices.data?.total ?? 0;
  const txList = transactions.data?.data ?? [];
  const txTotal = transactions.data?.total ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Financeiro</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b flex">
          {(
            [
              { key: 'invoices', label: 'Faturas' },
              { key: 'transactions', label: 'Transações' },
              { key: 'summary', label: 'Resumo' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Faturas ─────────────────────────────────────────────────── */}
        {tab === 'invoices' && (
          <>
            <div className="p-4 border-b flex flex-wrap items-center gap-3">
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
              <DateInput
                label="De"
                value={invoiceStart}
                onChange={(v) => {
                  setInvoiceStart(v);
                  setInvoicePage(0);
                }}
              />
              <DateInput
                label="Até"
                value={invoiceEnd}
                onChange={(v) => {
                  setInvoiceEnd(v);
                  setInvoicePage(0);
                }}
              />
              <span className="text-sm text-gray-500 ml-auto">{invoiceTotal} faturas</span>
            </div>

            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Nº', 'Cliente', 'Descrição', 'Valor', 'Vencimento', 'Status', ''].map((h) => (
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
                    <td colSpan={7} className="px-4 py-3 text-center text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : invoiceList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      Nenhuma fatura encontrada
                    </td>
                  </tr>
                ) : (
                  invoiceList.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3">{inv.client?.name ?? inv.clientId.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {inv.description}
                      </td>
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
                          className="text-xs text-red-500 hover:text-red-700"
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
          </>
        )}

        {/* ── Tab: Transações ──────────────────────────────────────────────── */}
        {tab === 'transactions' && (
          <>
            <div className="p-4 border-b flex flex-wrap items-center gap-3">
              <select
                value={txType}
                onChange={(e) => {
                  setTxType(e.target.value);
                  setTxPage(0);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos tipos</option>
                {(['INCOME', 'EXPENSE'] as TransactionType[]).map((t) => (
                  <option key={t} value={t}>
                    {t === 'INCOME' ? 'Receita' : 'Despesa'}
                  </option>
                ))}
              </select>
              <DateInput
                label="De"
                value={txStart}
                onChange={(v) => {
                  setTxStart(v);
                  setTxPage(0);
                }}
              />
              <DateInput
                label="Até"
                value={txEnd}
                onChange={(v) => {
                  setTxEnd(v);
                  setTxPage(0);
                }}
              />
              <span className="text-sm text-gray-500 ml-auto">{txTotal} transações</span>
            </div>

            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Tipo', 'Categoria', 'Descrição', 'Valor', 'Data', 'Método', 'Status', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : txList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  txList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge value={tx.type} />
                      </td>
                      <td className="px-4 py-3">{tx.category}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3 font-medium">{fmt(tx.amount)}</td>
                      <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3">{tx.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <Badge value={tx.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteTransaction.mutate(tx.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {txTotal > PAGE && (
              <div className="p-3 border-t flex items-center justify-between text-sm">
                <button
                  disabled={txPage === 0}
                  onClick={() => setTxPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Anterior
                </button>
                <span>
                  Página {txPage + 1} de {Math.ceil(txTotal / PAGE)}
                </span>
                <button
                  disabled={(txPage + 1) * PAGE >= txTotal}
                  onClick={() => setTxPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Tab: Resumo ──────────────────────────────────────────────────── */}
        {tab === 'summary' && (
          <div className="p-6">
            {summary.isLoading ? (
              <p className="text-center text-gray-400">Carregando...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Total de Receitas',
                    value: fmt(summary.data?.totalIncome),
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                  },
                  {
                    label: 'Total de Despesas',
                    value: fmt(summary.data?.totalExpense),
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                  },
                  {
                    label: 'Saldo Líquido',
                    value: fmt(summary.data?.balance),
                    color:
                      Number(summary.data?.balance ?? 0) >= 0 ? 'text-blue-600' : 'text-red-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    label: 'Faturas Pendentes',
                    value: String(summary.data?.pendingInvoices ?? 0),
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-50',
                  },
                ].map((card) => (
                  <div key={card.label} className={`${card.bg} rounded-lg p-6`}>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
