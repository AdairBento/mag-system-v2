import { apiClient } from './http';
import type {
  Vehicle,
  VehicleFilters,
  VehiclesResponse,
  CreateVehicleDto,
  UpdateVehicleDto,
} from '@/types/vehicle';

export const vehiclesApi = {
  list: async (filters?: VehicleFilters): Promise<VehiclesResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    return apiClient.get<VehiclesResponse>(`/vehicles?${params.toString()}`);
  },

  getById: async (id: string): Promise<Vehicle> => {
    return apiClient.get<Vehicle>(`/vehicles/${id}`);
  },

  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const { licensePlate, mileage, ...rest } = data;
    const payload = { ...rest, plate: licensePlate ?? rest.plate, km: rest.km ?? mileage };
    return apiClient.post<Vehicle>('/vehicles', payload);
  },

  update: async (id: string, data: UpdateVehicleDto): Promise<Vehicle> => {
    const { id: _id, licensePlate, mileage, ...rest } = data;
    const payload = {
      ...rest,
      ...(licensePlate !== undefined && { plate: licensePlate }),
      ...(mileage !== undefined && { km: mileage }),
    };
    return apiClient.put<Vehicle>(`/vehicles/${id}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/vehicles/${id}`);
  },
};
