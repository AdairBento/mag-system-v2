'use client';

import { useState } from 'react';
import { useManutencao, useDeleteManutencao } from '@/lib/hooks/use-manutencao';
import type { MaintenanceStatus, MaintenanceType } from '@/types/manutencao';

const STATUS_COLORS: Record<MaintenanceStatus, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

function fmt(v: number | string | null | undefined) {
  if (v == null) return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const TYPES: MaintenanceType[] = [
  'PREVENTIVE',
  'CORRECTIVE',
  'INSPECTION',
  'TIRE_CHANGE',
  'OIL_CHANGE',
  'OTHER',
];
const STATUSES: MaintenanceStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const PAGE = 10;

export default function ManutencaoPage() {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useManutencao({
    status: status || undefined,
    type: type || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteManutencao();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manutenção</h1>

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
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              resetPage();
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos tipos</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

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

          <span className="text-sm text-gray-500 ml-auto">{total} registros</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Veículo', 'Tipo', 'Descrição', 'Agendado', 'Custo', 'Status', ''].map((h) => (
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
                <td colSpan={7} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {m.vehicle ? (
                      <>
                        <div>
                          {m.vehicle.brand} {m.vehicle.model}
                        </div>
                        <div className="text-xs text-gray-500">{m.vehicle.plate}</div>
                      </>
                    ) : (
                      m.vehicleId.slice(0, 8)
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">{m.type}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{m.description}</td>
                  <td className="px-4 py-3">
                    {new Date(m.scheduledDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">{fmt(m.cost)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove.mutate(m.id)}
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
