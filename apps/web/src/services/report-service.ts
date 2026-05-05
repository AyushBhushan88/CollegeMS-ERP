import apiClient from '@/lib/api-client';

export const reportService = {
  getExecutiveSummary: async () => {
    const response = await apiClient.get('/report/executive-summary');
    return response.data;
  },
  getNaacReport: async (academicYear?: string) => {
    const response = await apiClient.get('/report/naac', { params: { academicYear } });
    return response.data;
  },
  getNirfReport: async (academicYear?: string) => {
    const response = await apiClient.get('/report/nirf', { params: { academicYear } });
    return response.data;
  },
  getAcademicPerformance: async () => {
    const response = await apiClient.get('/report/academic-performance');
    return response.data;
  },
  getAttendanceTrends: async () => {
    const response = await apiClient.get('/report/attendance-trends');
    return response.data;
  },
  downloadReport: async (type: string, format: string, academicYear?: string) => {
    const response = await apiClient.get('/report/download', {
      params: { type, format, academicYear },
    });
    return response.data;
  },
};
