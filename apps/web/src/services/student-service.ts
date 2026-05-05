import apiClient from '@/lib/api-client';

export const studentService = {
  getStudentsBySection: async (sectionId: string) => {
    const response = await apiClient.get(`/student/section/${sectionId}`);
    return response.data;
  },
  getStudentProfile: async (id: string) => {
    const response = await apiClient.get(`/student/profile/${id}`);
    return response.data;
  },
  updateStudentProfile: async (id: string, data: any) => {
    const response = await apiClient.put(`/student/profile/${id}`, data);
    return response.data;
  },
};
