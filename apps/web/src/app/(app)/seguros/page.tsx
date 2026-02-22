'use client';

import { useState } from 'react';
import { useSeguros, useDeleteSeguro } from '@/lib/hooks/use-seguros';
import type { InsuranceStatus } from '@/types/seguro';

const STATUS_COLORS: Record<InsuranceStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

function fmt(v: number | string) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const PAGE = 10;

export default function SegurosPage() {
  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useSeguros({
    status: status || undefined,
    provider: provider || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteSeguro();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seguros</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos status</option>
            {(['ACTIVE', 'EXPIRED', 'CANCELLED'] as InsuranceStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              resetPage();
            }}
            placeholder="Seguradora..."
            className="border rounded px-2 py-1 text-sm w-36"
          />

          <label className="flex items-center gap-1 text-sm text-gray-600">
            De
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                resetPage();
              }}
              className="border rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-600">
            Até
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                resetPage();
              }}
              className="border rounded px-2 py-1 text-sm"
            />
          </label>

          <span className="text-sm text-gray-500 ml-auto">{total} seguros</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Veículo',
                'Seguradora',
                'Apólice',
                'Cobertura',
                'Valor',
                'Vigência',
                'Status',
                '',
              ].map((h) => (
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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Nenhum seguro encontrado
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {s.vehicle ? (
                      <>
                        <div>
                          {s.vehicle.brand} {s.vehicle.model}
                        </div>
                        <div className="text-xs text-gray-500">{s.vehicle.plate}</div>
                      </>
                    ) : (
                      s.vehicleId.slice(0, 8)
                    )}
                  </td>
                  <td className="px-4 py-3">{s.provider}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.policyNumber}</td>
                  <td className="px-4 py-3">{s.coverageType}</td>
                  <td className="px-4 py-3 font-medium">{fmt(s.amount)}</td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(s.startDate).toLocaleDateString('pt-BR')} –{' '}
                    {new Date(s.endDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove.mutate(s.id)}
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

        {total > PAGE && (
          <div className="p-3 border-t flex items-center justify-between text-sm">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Anterior
            </button>
            <span>
              Página {page + 1} de {Math.ceil(total / PAGE)}
            </span>
            <button
              disabled={(page + 1) * PAGE >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
