import apiClient from '@/lib/api-client';

export const examinationService = {
  getExams: async () => {
    const response = await apiClient.get('/examination/exams');
    return response.data;
  },
  getExamDetails: async (id: string) => {
    const response = await apiClient.get(`/examination/exams/${id}`);
    return response.data;
  },
  scheduleExam: async (data: any) => {
    const response = await apiClient.post('/examination/exams/schedule', data);
    return response.data;
  },
  enterMarks: async (data: any) => {
    const response = await apiClient.post('/examination/marks', data);
    return response.data;
  },
  bulkEnterMarks: async (data: any) => {
    const response = await apiClient.post('/examination/marks/bulk', data);
    return response.data;
  },
  getStudentMarks: async (studentId: string) => {
    const response = await apiClient.get(`/examination/marks/student/${studentId}`);
    return response.data;
  },
  getExamMarks: async (examId: string, subjectId?: string) => {
    const response = await apiClient.get(`/examination/marks/exam/${examId}`, {
      params: { subjectId },
    });
    return response.data;
  },
  getTranscripts: async (studentId: string) => {
    const response = await apiClient.get(`/examination/transcripts/student/${studentId}`);
    return response.data;
  },
  generateTranscript: async (studentId: string, semester: number) => {
    const response = await apiClient.post('/examination/transcripts/generate', {
      studentId,
      semester,
    });
    return response.data;
  },
};
