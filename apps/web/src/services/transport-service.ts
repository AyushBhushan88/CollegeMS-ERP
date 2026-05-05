import apiClient from '@/lib/api-client';

export const transportService = {
  getStats: async () => {
    const response = await apiClient.get('/transport/stats');
    return response.data;
  },
  getRoutes: async () => {
    const response = await apiClient.get('/transport/routes');
    return response.data;
  },
  getVehicles: async () => {
    const response = await apiClient.get('/transport/vehicles');
    return response.data;
  },
  createRoute: async (data: any) => {
    const response = await apiClient.post('/transport/routes', data);
    return response.data;
  },
  createVehicle: async (data: any) => {
    const response = await apiClient.post('/transport/vehicles', data);
    return response.data;
  },
  allocateTransport: async (data: any) => {
    const response = await apiClient.post('/transport/allocations', data);
    return response.data;
  },
  getRecentAllocations: async () => {
    const response = await apiClient.get('/transport/recent-allocations');
    return response.data;
  },
};
