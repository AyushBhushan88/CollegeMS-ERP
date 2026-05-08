import apiClient from '@/lib/api-client';

export const academicService = {
  getPrograms: async () => {
    const response = await apiClient.get('/academic/programs');
    return response.data;
  },
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
  generateTimetable: async (sectionId: string) => {
    const response = await apiClient.post(`/academic/timetable/generate/${sectionId}`);
    return response.data;
  },
};
