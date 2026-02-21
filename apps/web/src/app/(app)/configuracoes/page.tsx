'use client';

import { useState } from 'react';
import { useSettings, useUpsertSetting, useDeleteSetting } from '@/lib/hooks/use-settings';

export default function ConfiguracoesPage() {
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data, isLoading } = useSettings(search || undefined);
  const upsert = useUpsertSetting();
  const remove = useDeleteSetting();

  const items = data?.data ?? [];

  function startEdit(id: string, value: string) {
    setEditId(id);
    setEditValue(value);
  }

  function saveEdit(key: string) {
    upsert.mutate({ key, value: editValue });
    setEditId(null);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar chave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm w-64"
          />
          <span className="text-sm text-gray-500 ml-auto">{items.length} configurações</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Chave', 'Tipo', 'Valor', ''].map((h) => (
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
                <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma configuração encontrada
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{s.key}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.type}</td>
                  <td className="px-4 py-3">
                    {editId === s.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(s.key)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(s.key)}
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      <span className="font-mono text-xs">{s.value}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => startEdit(s.id, s.value)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
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
      </div>
    </div>
  );
}
