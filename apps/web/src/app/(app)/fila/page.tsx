'use client';

import { useState } from 'react';
import { useQueueJobs, useProcessJob, useCancelJob } from '@/lib/hooks/use-fila';
import type { JobStatus, JobPriority } from '@/types/fila';

const STATUS_COLORS: Record<JobStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  FAILED: 'bg-orange-100 text-orange-800',
};

const PRIORITY_COLORS: Record<JobPriority, string> = {
  LOW: 'bg-gray-100 text-gray-500',
  NORMAL: 'bg-blue-50 text-blue-600',
  HIGH: 'bg-red-100 text-red-700',
};

const STATUSES: JobStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED'];

export default function FilaPage() {
  const [status, setStatus] = useState<JobStatus | ''>('');

  const { data: items = [], isLoading } = useQueueJobs(status || undefined);
  const process = useProcessJob();
  const cancel = useCancelJob();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fila de Jobs</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus | '')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{items.length} jobs</span>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Nome', 'Prioridade', 'Status', 'Delay (ms)', 'Tentativas', 'Criado em', ''].map(
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
                  Nenhum job encontrado
                </td>
              </tr>
            ) : (
              items.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{j.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[j.priority]}`}
                    >
                      {j.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[j.status]}`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{j.delay}</td>
                  <td className="px-4 py-3 text-gray-500">{j.retries}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(j.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {j.status === 'PENDING' && (
                      <button
                        onClick={() => process.mutate(j.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Processar
                      </button>
                    )}
                    {(j.status === 'PENDING' || j.status === 'PROCESSING') && (
                      <button
                        onClick={() => cancel.mutate(j.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Cancelar
                      </button>
                    )}
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
