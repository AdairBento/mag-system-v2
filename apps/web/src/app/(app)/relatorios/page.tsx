'use client';

import { useState } from 'react';
import {
  useDashboard,
  useRentalReport,
  useFleetReport,
  useFinancialReport,
} from '@/lib/hooks/use-reports';

type Tab = 'locacoes' | 'frota' | 'financeiro';

function fmt(v: number | string | undefined) {
  if (v == null) return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function StatCard({
  label,
  value,
  color = 'text-gray-900',
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
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

export default function RelatoriosPage() {
  const [tab, setTab] = useState<Tab>('locacoes');
  const [rentalStart, setRentalStart] = useState('');
  const [rentalEnd, setRentalEnd] = useState('');
  const [financialStart, setFinancialStart] = useState('');
  const [financialEnd, setFinancialEnd] = useState('');

  const dashboard = useDashboard();
  const rentalReport = useRentalReport(rentalStart || undefined, rentalEnd || undefined);
  const fleetReport = useFleetReport();
  const financialReport = useFinancialReport(
    financialStart || undefined,
    financialEnd || undefined
  );

  const d = dashboard.data;
  const r = rentalReport.data;
  const fl = fleetReport.data;
  const fi = financialReport.data;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'locacoes', label: 'Locações' },
    { id: 'frota', label: 'Frota' },
    { id: 'financeiro', label: 'Financeiro' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      {/* Dashboard summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clientes" value={dashboard.isLoading ? '…' : (d?.totalClients ?? '—')} />
        <StatCard label="Veículos" value={dashboard.isLoading ? '…' : (d?.totalVehicles ?? '—')} />
        <StatCard
          label="Locações Ativas"
          value={dashboard.isLoading ? '…' : (d?.activeRentals ?? '—')}
          color="text-blue-600"
        />
        <StatCard
          label="Fat. Pendentes"
          value={dashboard.isLoading ? '…' : (d?.pendingInvoices ?? '—')}
          color="text-yellow-600"
        />
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Locações tab */}
        {tab === 'locacoes' && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <DateInput label="De" value={rentalStart} onChange={setRentalStart} />
              <DateInput label="Até" value={rentalEnd} onChange={setRentalEnd} />
            </div>

            {rentalReport.isLoading ? (
              <p className="text-gray-400 text-sm">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Por Status</h3>
                  {r?.byStatus && r.byStatus.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {r.byStatus.map((item) => (
                        <li key={item.status} className="flex justify-between">
                          <span className="text-gray-600">{item.status}</span>
                          <span className="font-medium">{item.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Sem dados</p>
                  )}
                </div>
                <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-1">Receita Total</p>
                  <p className="text-2xl font-bold text-green-700">{fmt(r?.totalRevenue)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Frota tab */}
        {tab === 'frota' && (
          <div className="p-5">
            {fleetReport.isLoading ? (
              <p className="text-gray-400 text-sm">Carregando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Por Status</h3>
                  {fl?.byStatus && fl.byStatus.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {fl.byStatus.map((item) => (
                        <li key={item.status} className="flex justify-between">
                          <span className="text-gray-600">{item.status}</span>
                          <span className="font-medium">{item.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Sem dados</p>
                  )}
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-1">Diária Média</p>
                  <p className="text-2xl font-bold text-blue-700">{fmt(fl?.avgDailyRate)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financeiro tab */}
        {tab === 'financeiro' && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <DateInput label="De" value={financialStart} onChange={setFinancialStart} />
              <DateInput label="Até" value={financialEnd} onChange={setFinancialEnd} />
            </div>

            {financialReport.isLoading ? (
              <p className="text-gray-400 text-sm">Carregando...</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Receitas" value={fmt(fi?.totalIncome)} color="text-green-600" />
                <StatCard label="Despesas" value={fmt(fi?.totalExpense)} color="text-red-600" />
                <StatCard
                  label="Saldo"
                  value={fmt(fi?.net)}
                  color={Number(fi?.net) < 0 ? 'text-red-600' : 'text-blue-600'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
