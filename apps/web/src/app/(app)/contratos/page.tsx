'use client';

import { useState } from 'react';
import { useContratos, useSignContrato, useDeleteContrato } from '@/lib/hooks/use-contratos';
import type { ContractStatus } from '@/types/contrato';

const STATUS_COLORS: Record<ContractStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SIGNED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const PAGE = 10;

export default function ContratosPage() {
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useContratos({
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const signContract = useSignContrato();
  const deleteContract = useDeleteContrato();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contratos</h1>

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
            {(['PENDING', 'SIGNED', 'CANCELLED'] as ContractStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
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

          <span className="text-sm text-gray-500 ml-auto">{total} contratos</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Locação', 'Cliente / Veículo', 'Status', 'Assinado em', ''].map((h) => (
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
                <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Nenhum contrato encontrado
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.rentalId.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <div>{c.rental?.client?.name ?? '—'}</div>
                    <div className="text-gray-500 text-xs">
                      {c.rental?.vehicle
                        ? `${c.rental.vehicle.brand} ${c.rental.vehicle.model}`
                        : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.signedAt ? new Date(c.signedAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {c.status === 'PENDING' && (
                      <button
                        onClick={() => signContract.mutate(c.id)}
                        disabled={signContract.isPending}
                        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-40"
                      >
                        Assinar
                      </button>
                    )}
                    <button
                      onClick={() => deleteContract.mutate(c.id)}
                      disabled={deleteContract.isPending}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
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
