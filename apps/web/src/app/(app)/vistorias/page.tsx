'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useVistoriasDamages,
  useVistoriasPhotos,
  useVistoriasSummary,
  useDeleteDamage,
  useDeletePhoto,
} from '@/lib/hooks/use-vistorias';
import type { DamageSeverity } from '@/types/vistoria';

const SEVERITY_COLORS: Record<DamageSeverity, string> = {
  MINOR: 'bg-yellow-100 text-yellow-800',
  MODERATE: 'bg-orange-100 text-orange-800',
  SEVERE: 'bg-red-100 text-red-800',
};

function fmt(v?: number | null) {
  if (v == null) return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function VistoriasPage() {
  const [inspectionId, setInspectionId] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'damages' | 'photos'>('damages');

  const active = search.trim();

  const { data: damages, isLoading: loadingDamages } = useVistoriasDamages(active);
  const { data: photos, isLoading: loadingPhotos } = useVistoriasPhotos(active);
  const { data: summary } = useVistoriasSummary(active);
  const removeDamage = useDeleteDamage();
  const removePhoto = useDeletePhoto();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(inspectionId.trim());
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vistorias</h1>

      {/* Search by inspection ID */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={inspectionId}
          onChange={(e) => setInspectionId(e.target.value)}
          placeholder="ID da inspeção..."
          className="border rounded px-3 py-2 text-sm flex-1 max-w-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {/* Summary card */}
      {active && summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Danos</div>
            <div className="text-2xl font-bold">{summary.damages.count}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Custo estimado</div>
            <div className="text-2xl font-bold">{fmt(summary.damages.totalCost)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Fotos</div>
            <div className="text-2xl font-bold">{summary.photos.count}</div>
          </div>
        </div>
      )}

      {!active ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-400">
          Digite o ID de uma inspeção para visualizar danos e fotos.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="border-b flex">
            {(['damages', 'photos'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'damages' ? 'Danos' : 'Fotos'}
              </button>
            ))}
          </div>

          {/* Damages tab */}
          {tab === 'damages' && (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Descrição', 'Local', 'Severidade', 'Custo est.', ''].map((h) => (
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
                {loadingDamages ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : !damages || damages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Nenhum dano registrado
                    </td>
                  </tr>
                ) : (
                  damages.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{d.description}</td>
                      <td className="px-4 py-3 text-gray-600">{d.location}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[d.severity]}`}
                        >
                          {d.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">{fmt(d.estimatedCost)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeDamage.mutate(d.id)}
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
          )}

          {/* Photos tab */}
          {tab === 'photos' && (
            <div>
              {loadingPhotos ? (
                <div className="px-4 py-8 text-center text-gray-400">Carregando...</div>
              ) : !photos || photos.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400">Nenhuma foto registrada</div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((p) => (
                    <div key={p.id} className="border rounded-lg overflow-hidden">
                      <Image
                        src={p.url}
                        alt={p.description ?? 'Foto da vistoria'}
                        width={300}
                        height={128}
                        unoptimized
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        {p.description && (
                          <p className="text-xs text-gray-600 truncate">{p.description}</p>
                        )}
                        <button
                          onClick={() => removePhoto.mutate(p.id)}
                          className="mt-1 text-xs text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
