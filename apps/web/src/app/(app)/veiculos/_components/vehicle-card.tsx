import { Car } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-700',
    RENTED: 'bg-blue-100 text-blue-700',
    MAINTENANCE: 'bg-yellow-100 text-yellow-700',
    INACTIVE: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-teal-600" />
          <span className="font-semibold">{vehicle.plate ?? vehicle.licensePlate}</span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${statusColors[vehicle.status ?? 'AVAILABLE'] || ''}`}
        >
          {vehicle.status}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1">
        {vehicle.brand} {vehicle.model}
      </h3>
      <p className="text-slate-600 text-sm mb-3">
        {vehicle.year} • {vehicle.color}
      </p>

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-slate-500 text-sm">{vehicle.category}</span>
        <span className="text-teal-600 font-bold">
          R$ {(vehicle.dailyRate ?? 0).toFixed(2)}/dia
        </span>
      </div>
    </div>
  );
}
