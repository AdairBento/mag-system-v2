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
    return apiClient.post<Vehicle>('/vehicles', data);
  },

  update: async (id: string, data: UpdateVehicleDto): Promise<Vehicle> => {
    return apiClient.patch<Vehicle>(`/vehicles/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/vehicles/${id}`);
  },
};
