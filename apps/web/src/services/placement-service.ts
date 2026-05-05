import apiClient from '@/lib/api-client';

export const placementService = {
  getStats: async () => {
    const response = await apiClient.get('/placement/stats');
    return response.data;
  },
  getDrives: async () => {
    const response = await apiClient.get('/placement/drives');
    return response.data;
  },
  getDriveDetails: async (id: string) => {
    const response = await apiClient.get(`/placement/drives/${id}`);
    return response.data;
  },
  createDrive: async (data: any) => {
    const response = await apiClient.post('/placement/drives', data);
    return response.data;
  },
  applyForDrive: async (data: any) => {
    const response = await apiClient.post('/placement/apply', data);
    return response.data;
  },
  updateApplicationStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/placement/applications/${id}/status`, { status });
    return response.data;
  },
  recordResult: async (data: any) => {
    const response = await apiClient.post('/placement/results', data);
    return response.data;
  },
};
