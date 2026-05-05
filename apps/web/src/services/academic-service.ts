import apiClient from '@/lib/api-client';

export const academicService = {
  getSubjects: async () => {
    const response = await apiClient.get('/academic/subjects');
    return response.data;
  },
  createSubject: async (data: any) => {
    const response = await apiClient.post('/academic/subjects', data);
    return response.data;
  },
  getSections: async () => {
    const response = await apiClient.get('/academic/sections');
    return response.data;
  },
  createSection: async (data: any) => {
    const response = await apiClient.post('/academic/sections', data);
    return response.data;
  },
  getTimetableBySection: async (sectionId: string) => {
    const response = await apiClient.get(`/academic/timetable/section/${sectionId}`);
    return response.data;
  },
  createTimetableSlot: async (data: any) => {
    const response = await apiClient.post('/academic/timetable', data);
    return response.data;
  },
};
