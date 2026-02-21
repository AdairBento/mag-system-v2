'use client';

import {
  useDashboard,
  useRentalReport,
  useFleetReport,
  useFinancialReport,
} from '@/lib/hooks/use-reports';

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

export default function RelatoriosPage() {
  const dashboard = useDashboard();
  const rentalReport = useRentalReport();
  const fleetReport = useFleetReport();
  const financialReport = useFinancialReport();

  const d = dashboard.data;
  const r = rentalReport.data;
  const fl = fleetReport.data;
  const fi = financialReport.data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      <h2 className="text-lg font-semibold mb-3 text-gray-700">Visão Geral</h2>
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

      <h2 className="text-lg font-semibold mb-3 text-gray-700">Financeiro</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Receitas"
          value={financialReport.isLoading ? '…' : fmt(fi?.totalIncome)}
          color="text-green-600"
        />
        <StatCard
          label="Despesas"
          value={financialReport.isLoading ? '…' : fmt(fi?.totalExpense)}
          color="text-red-600"
        />
        <StatCard
          label="Saldo"
          value={financialReport.isLoading ? '…' : fmt(fi?.balance)}
          color="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Locações por Status</h3>
          {rentalReport.isLoading ? (
            <p className="text-gray-400 text-sm">Carregando...</p>
          ) : r?.byStatus && Object.keys(r.byStatus).length > 0 ? (
            <ul className="space-y-1 text-sm">
              {Object.entries(r.byStatus).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">Sem dados</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Frota por Status</h3>
          {fleetReport.isLoading ? (
            <p className="text-gray-400 text-sm">Carregando...</p>
          ) : fl?.byStatus && Object.keys(fl.byStatus).length > 0 ? (
            <ul className="space-y-1 text-sm">
              {Object.entries(fl.byStatus).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">Sem dados</p>
          )}
          {fl && (
            <p className="mt-3 text-xs text-gray-500">
              Diária média: <span className="font-medium">{fmt(fl.avgDailyRate)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
