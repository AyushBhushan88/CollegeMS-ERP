import apiClient from '@/lib/api-client';

export const communicationService = {
  getNotifications: async () => {
    const response = await apiClient.get('/communication/notifications');
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/communication/notifications/${id}/read`);
    return response.data;
  },
  getSettings: async () => {
    const response = await apiClient.get('/communication/notifications/settings');
    return response.data;
  },
  updateSettings: async (settings: any) => {
    const response = await apiClient.put('/communication/notifications/settings', settings);
    return response.data;
  },
};
