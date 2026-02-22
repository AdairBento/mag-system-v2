'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { VehicleStatus, VehicleCategory, FuelType, Transmission } from '@/types/vehicle';
import type { Vehicle, CreateVehicleDto } from '@/types/vehicle';

interface VehicleFormModalProps {
  isOpen: boolean;
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDto) => void;
}

export function VehicleFormModal({ isOpen, vehicle, onClose, onSubmit }: VehicleFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleDto>({
    defaultValues: {
      licensePlate: '',
      registrationNumber: '',
      chassis: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      category: VehicleCategory.COMPACT,
      fuelType: FuelType.FLEX,
      transmission: Transmission.MANUAL,
      seats: 5,
      km: 0,
      dailyRate: 0,
      status: VehicleStatus.AVAILABLE,
    },
  });

  useEffect(() => {
    if (vehicle) {
      const normalized: CreateVehicleDto = {
        licensePlate: vehicle.licensePlate ?? vehicle.plate ?? '',
        brand: vehicle.brand ?? '',
        model: vehicle.model ?? '',
        year: vehicle.year ?? undefined,
        color: vehicle.color ?? '',
        category: vehicle.category ?? undefined,
        status: vehicle.status ?? undefined,
        fuelType: vehicle.fuelType ?? undefined,
        transmission: vehicle.transmission ?? undefined,
        dailyRate: vehicle.dailyRate ?? undefined,
        mileage: vehicle.mileage ?? vehicle.km ?? undefined,
        features: vehicle.features ?? undefined,
        imageUrl: vehicle.imageUrl ?? undefined,
        registrationNumber: vehicle.registrationNumber ?? undefined,
        chassis: vehicle.chassis ?? undefined,
        seats: vehicle.seats ?? undefined,
      };
      reset(normalized);
    } else {
      reset({
        licensePlate: '',
        registrationNumber: '',
        chassis: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        category: VehicleCategory.COMPACT,
        fuelType: FuelType.FLEX,
        transmission: Transmission.MANUAL,
        seats: 5,
        km: 0,
        dailyRate: 0,
        status: VehicleStatus.AVAILABLE,
      });
    }
  }, [vehicle, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{vehicle ? 'Editar' : 'Novo'} Veículo</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Row 1: Placa, Renavam, Chassi */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Placa *</label>
              <input
                {...register('licensePlate', { required: 'Campo obrigatório' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="ABC-1234"
                maxLength={8}
              />
              {errors.licensePlate && (
                <p className="text-xs text-red-600 mt-1">{errors.licensePlate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Renavam *</label>
              <input
                {...register('registrationNumber', { required: 'Campo obrigatório' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="00000000000"
              />
              {errors.registrationNumber && (
                <p className="text-xs text-red-600 mt-1">{errors.registrationNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chassi *</label>
              <input
                {...register('chassis', {
                  required: 'Campo obrigatório',
                  minLength: 17,
                  maxLength: 17,
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="17 caracteres"
                maxLength={17}
              />
              {errors.chassis && <p className="text-xs text-red-600 mt-1">17 caracteres</p>}
            </div>
          </div>

          {/* Row 2: Marca, Modelo, Ano */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Marca *</label>
              <input
                {...register('brand', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Volkswagen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modelo *</label>
              <input
                {...register('model', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Gol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ano *</label>
              <input
                {...register('year', { required: true, valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                min={1990}
                max={2027}
              />
            </div>
          </div>

          {/* Row 3: Cor, Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cor *</label>
              <input
                {...register('color', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Prata"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value={VehicleCategory.COMPACT}>Compacto</option>
                <option value={VehicleCategory.SEDAN}>Sedan</option>
                <option value={VehicleCategory.SUV}>SUV</option>
                <option value={VehicleCategory.PICKUP}>Pickup</option>
                <option value={VehicleCategory.VAN}>Van</option>
                <option value={VehicleCategory.LUXURY}>Luxo</option>
              </select>
            </div>
          </div>

          {/* Row 4: Combustível, Câmbio, Lugares */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Combustível *</label>
              <select
                {...register('fuelType')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value={FuelType.GASOLINE}>Gasolina</option>
                <option value={FuelType.ETHANOL}>Etanol</option>
                <option value={FuelType.FLEX}>Flex</option>
                <option value={FuelType.DIESEL}>Diesel</option>
                <option value={FuelType.ELECTRIC}>Elétrico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Câmbio *</label>
              <select
                {...register('transmission')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value={Transmission.MANUAL}>Manual</option>
                <option value={Transmission.AUTOMATIC}>Automático</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lugares *</label>
              <input
                {...register('seats', { required: true, valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                min={2}
                max={12}
              />
            </div>
          </div>

          {/* Row 5: KM, Diária, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quilometragem *</label>
              <input
                {...register('km', { required: true, valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diária (R$) *</label>
              <input
                {...register('dailyRate', { required: true, valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                min={0}
                placeholder="150.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value={VehicleStatus.AVAILABLE}>Disponível</option>
                <option value={VehicleStatus.RENTED}>Alugado</option>
                <option value={VehicleStatus.MAINTENANCE}>Manutenção</option>
                <option value={VehicleStatus.INACTIVE}>Inativo</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              {vehicle ? 'Atualizar' : 'Criar'} Veículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
