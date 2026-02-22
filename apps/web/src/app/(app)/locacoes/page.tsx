'use client';

import { useState } from 'react';
import { useLocacoes, useDeleteLocacao } from '@/lib/hooks/use-locacoes';
import type { RentalStatus } from '@/types/locacao';

const STATUS_COLORS: Record<RentalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUSES: RentalStatus[] = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
const PAGE = 10;

function fmt(v: number | string) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function LocacoesPage() {
  const [status, setStatus] = useState('');
  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useLocacoes({
    status: (status as RentalStatus) || undefined,
    clientId: clientId || undefined,
    vehicleId: vehicleId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteLocacao();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Locações</h1>

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

          <input
            type="text"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              resetPage();
            }}
            placeholder="ID do cliente..."
            className="border rounded px-2 py-1 text-sm w-52"
          />

          <input
            type="text"
            value={vehicleId}
            onChange={(e) => {
              setVehicleId(e.target.value);
              resetPage();
            }}
            placeholder="ID do veículo..."
            className="border rounded px-2 py-1 text-sm w-52"
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

          <span className="text-sm text-gray-500 ml-auto">{total} locações</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Início', 'Prev. Devolução', 'Dias', 'Total', 'Status', ''].map((h) => (
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
                  Nenhuma locação encontrada
                </td>
              </tr>
            ) : (
              items.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{l.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(l.startDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(l.expectedEndDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">{l.totalDays}d</td>
                  <td className="px-4 py-3 font-medium">{fmt(l.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove.mutate(l.id)}
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
