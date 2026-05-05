import apiClient from '@/lib/api-client';

export const hostelService = {
  getStats: async () => {
    const response = await apiClient.get('/hostel/stats');
    return response.data;
  },
  getRecentAllocations: async () => {
    const response = await apiClient.get('/hostel/recent-allocations');
    return response.data;
  },
  getHostels: async () => {
    const response = await apiClient.get('/hostel');
    return response.data;
  },
  getHostelDetails: async (id: string) => {
    const response = await apiClient.get(`/hostel/${id}`);
    return response.data;
  },
  createHostel: async (data: any) => {
    const response = await apiClient.post('/hostel', data);
    return response.data;
  },
  addRoom: async (hostelId: string, data: any) => {
    const response = await apiClient.post(`/hostel/${hostelId}/rooms`, data);
    return response.data;
  },
  allocateRoom: async (data: any) => {
    const response = await apiClient.post('/hostel/allocations', data);
    return response.data;
  },
};
