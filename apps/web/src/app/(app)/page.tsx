'use client';

import Link from 'next/link';
import { useDashboard } from '@/lib/hooks/use-reports';

const cards = [
  { label: 'Clientes Ativos', key: 'totalClients', href: '/clientes', color: 'text-emerald-600' },
  { label: 'Veículos', key: 'totalVehicles', href: '/veiculos', color: 'text-amber-600' },
  { label: 'Locações Ativas', key: 'activeRentals', href: '/locacoes', color: 'text-blue-600' },
  {
    label: 'Faturas Pendentes',
    key: 'pendingInvoices',
    href: '/financeiro',
    color: 'text-yellow-600',
  },
] as const;

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao Sistema MAG de Gestão de Locação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map(({ label, key, href, color }) => (
          <Link key={key} href={href}>
            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-sm font-medium text-gray-600">{label}</div>
              <div className={`text-2xl font-bold mt-2 ${color}`}>
                {isLoading ? '…' : (data?.[key] ?? '—')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
