'use client';

import { useState } from 'react';
import { useSinistros, useDeleteSinistro } from '@/lib/hooks/use-sinistros';
import type { AccidentSeverity, AccidentStatus } from '@/types/sinistro';

const SEVERITY_COLORS: Record<AccidentSeverity, string> = {
  MINOR: 'bg-blue-100 text-blue-800',
  MODERATE: 'bg-yellow-100 text-yellow-800',
  SEVERE: 'bg-orange-100 text-orange-800',
  TOTAL_LOSS: 'bg-red-100 text-red-800',
};

const STATUS_COLORS: Record<AccidentStatus, string> = {
  REPORTED: 'bg-gray-100 text-gray-700',
  UNDER_INVESTIGATION: 'bg-yellow-100 text-yellow-800',
  CLAIM_SUBMITTED: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-500',
};

function fmt(v: number | string | null | undefined) {
  if (v == null) return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function SinistrosPage() {
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [page, setPage] = useState(0);
  const PAGE = 10;

  const { data, isLoading } = useSinistros({
    status: status || undefined,
    severity: severity || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteSinistro();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sinistros</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos status</option>
            {(
              [
                'REPORTED',
                'UNDER_INVESTIGATION',
                'CLAIM_SUBMITTED',
                'RESOLVED',
                'CLOSED',
              ] as AccidentStatus[]
            ).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value);
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todas severidades</option>
            {(['MINOR', 'MODERATE', 'SEVERE', 'TOTAL_LOSS'] as AccidentSeverity[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{total} sinistros</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Veículo', 'Data', 'Local', 'Severidade', 'Custo Est.', 'Status', ''].map((h) => (
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
                  Nenhum sinistro encontrado
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
                  <td className="px-4 py-3">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{s.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[s.severity]}`}
                    >
                      {s.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">{fmt(s.estimatedCost)}</td>
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
