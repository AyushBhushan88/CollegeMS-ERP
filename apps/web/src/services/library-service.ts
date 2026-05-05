import apiClient from '@/lib/api-client';

export const libraryService = {
  getBooks: async () => {
    const response = await apiClient.get('/library/books');
    return response.data;
  },
  getBookDetails: async (id: string) => {
    const response = await apiClient.get(`/library/books/${id}`);
    return response.data;
  },
  createBook: async (data: any) => {
    const response = await apiClient.post('/library/books', data);
    return response.data;
  },
  addBookCopy: async (bookId: string, data: any) => {
    const response = await apiClient.post(`/library/books/${bookId}/copies`, data);
    return response.data;
  },
  issueBook: async (data: any) => {
    const response = await apiClient.post('/library/issue', data);
    return response.data;
  },
  returnBook: async (accessionNumber: string) => {
    const response = await apiClient.post('/library/return', { accessionNumber });
    return response.data;
  },
  getRecentIssues: async () => {
    const response = await apiClient.get('/library/recent-issues');
    return response.data;
  },
};
