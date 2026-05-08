import apiClient from '@/lib/api-client';

export const admissionService = {
  submitApplication: async (data: any) => {
    const response = await apiClient.post('/admission/apply', data);
    return response.data;
  },
  
  // Gets all applications if no userId is provided (Admin use case)
  getApplications: async (userId?: string) => {
    const url = userId ? `/admission/applications?userId=${userId}` : '/admission/applications';
    const response = await apiClient.get(url);
    return response.data;
  },

  getAllApplications: async () => {
    const response = await apiClient.get('/admission/applications');
    return response.data;
  },

  updateApplicationStatus: async (id: string, data: { status: string; remarks?: string }) => {
    const response = await apiClient.put(`/admission/applications/${id}/status`, data);
    return response.data;
  },

  getMeritList: async (programId: string) => {
    const response = await apiClient.get(`/admission/merit-list/${programId}`);
    return response.data;
  },
};
