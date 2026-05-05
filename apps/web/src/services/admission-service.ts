import apiClient from '@/lib/api-client';

export const admissionService = {
  submitApplication: async (data: any) => {
    const response = await apiClient.post('/admission/apply', data);
    return response.data;
  },
  getApplications: async (userId?: string) => {
    const response = await apiClient.get('/admission/applications', { params: { userId } });
    return response.data;
  },
  updateApplicationStatus: async (id: string, status: string, remarks?: string) => {
    const response = await apiClient.put(`/admission/applications/${id}/status`, {
      status,
      remarks,
    });
    return response.data;
  },
  getMeritList: async (programId: string) => {
    const response = await apiClient.get(`/admission/merit-list/${programId}`);
    return response.data;
  },
};
