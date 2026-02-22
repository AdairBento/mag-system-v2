'use client';

import { useState } from 'react';
import { useMotoristas, useDeleteMotorista } from '@/lib/hooks/use-motoristas';
import type { DriverStatus } from '@/types/motorista';

const STATUS_COLORS: Record<DriverStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  SUSPENDED: 'bg-red-100 text-red-800',
};

const STATUSES: DriverStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
const PAGE = 10;

export default function MotoristasPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useMotoristas({
    search: search || undefined,
    status: (status as DriverStatus) || undefined,
    skip: page * PAGE,
    take: PAGE,
  });
  const remove = useDeleteMotorista();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Motoristas</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Buscar nome, CPF ou habilitação..."
            className="border rounded px-2 py-1 text-sm w-64"
          />

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

          <span className="text-sm text-gray-500 ml-auto">{total} motoristas</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Nome', 'Documento', 'Habilitação', 'Categoria', 'Venc. CNH', 'Status', ''].map(
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum motorista encontrado
                </td>
              </tr>
            ) : (
              items.map((m) => {
                const expiry = new Date(m.licenseExpiresAt);
                const expired = expiry < new Date();
                return (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{m.document}</td>
                    <td className="px-4 py-3 font-mono text-xs">{m.licenseNumber}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {m.licenseCategory}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-xs ${expired ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                    >
                      {expiry.toLocaleDateString('pt-BR')}
                      {expired && ' ⚠'}
                    </td>
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
                );
              })
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
