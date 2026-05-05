import apiClient from '@/lib/api-client';

export const hrService = {
  getEmployees: async () => {
    const response = await apiClient.get('/hr/employees');
    return response.data;
  },
  getEmployee: async (id: string) => {
    const response = await apiClient.get(`/hr/employees/${id}`);
    return response.data;
  },
  createEmployee: async (data: any) => {
    const response = await apiClient.post('/hr/employees', data);
    return response.data;
  },
  getLeaveRequests: async () => {
    const response = await apiClient.get('/hr/leave-requests');
    return response.data;
  },
  updateLeaveStatus: async (id: string, status: string, remarks?: string) => {
    const response = await apiClient.put(`/hr/leave-requests/${id}/status`, { status, remarks });
    return response.data;
  },
  applyLeave: async (data: any) => {
    const response = await apiClient.post('/hr/leave-requests', data);
    return response.data;
  },
};
