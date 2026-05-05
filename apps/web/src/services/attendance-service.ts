import apiClient from '@/lib/api-client';

export const attendanceService = {
  getStudentAttendance: async (studentId: string) => {
    const response = await apiClient.get(`/attendance/student/${studentId}`);
    return response.data;
  },
  getStudentStats: async (studentId: string) => {
    const response = await apiClient.get(`/attendance/stats/${studentId}`);
    return response.data;
  },
  submitBulkAttendance: async (records: any[]) => {
    const response = await apiClient.post('/attendance/bulk', { records });
    return response.data;
  },
};
