'use client';

import { useState } from 'react';
import { useNotifications } from '@/lib/hooks/use-notificacoes';

const PAGE = 10;

export default function NotificacoesPage() {
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useNotifications({
    resource: resource || undefined,
    action: action || undefined,
    skip: page * PAGE,
    take: PAGE,
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  function resetPage() {
    setPage(0);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notificações</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={resource}
            onChange={(e) => {
              setResource(e.target.value);
              resetPage();
            }}
            placeholder="Recurso..."
            className="border rounded px-2 py-1 text-sm w-36"
          />
          <input
            type="text"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              resetPage();
            }}
            placeholder="Ação..."
            className="border rounded px-2 py-1 text-sm w-36"
          />
          <span className="text-sm text-gray-500 ml-auto">{total} registros</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Ação', 'Recurso', 'Resource ID', 'Usuário', 'Data'].map((h) => (
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
                <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma notificação encontrada
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {n.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{n.resource}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {n.resourceId ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{n.userId ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString('pt-BR')}
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
