'use client';

import { useState } from 'react';
import { useMultas, useDeleteMulta } from '@/lib/hooks/use-multas';
import type { FineStatus } from '@/types/multa';

const STATUS_COLORS: Record<FineStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CONTESTED: 'bg-purple-100 text-purple-800',
};

function fmt(v: number | string) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function MultasPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const PAGE = 10;

  const { data, isLoading } = useMultas({
    status: status || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteMulta();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Multas</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos status</option>
            {(['PENDING', 'PAID', 'OVERDUE', 'CONTESTED'] as FineStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{total} multas</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Veículo', 'Local', 'Valor', 'Vencimento', 'Status', ''].map((h) => (
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
                  Nenhuma multa encontrada
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
                  <td className="px-4 py-3 max-w-xs truncate">{m.location}</td>
                  <td className="px-4 py-3 font-medium">{fmt(m.amount)}</td>
                  <td className="px-4 py-3">{new Date(m.dueDate).toLocaleDateString('pt-BR')}</td>
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
