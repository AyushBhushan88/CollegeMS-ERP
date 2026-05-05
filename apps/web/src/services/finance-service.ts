import apiClient from '@/lib/api-client';

export const financeService = {
  getFeeStructures: async (programId: string) => {
    const response = await apiClient.get(`/finance/fee-structures?programId=${programId}`);
    return response.data;
  },
  getStudentTransactions: async (studentId: string) => {
    const response = await apiClient.get(`/finance/transactions/student/${studentId}`);
    return response.data;
  },
  createPaymentIntent: async (data: {
    amount: number;
    feeStructureId: string;
    studentId: string;
  }) => {
    const response = await apiClient.post('/finance/payments/create-intent', data);
    return response.data;
  },
  verifyPayment: async (data: { transactionId: string; gatewayReference: string }) => {
    const response = await apiClient.post('/finance/payments/verify', data);
    return response.data;
  },
};
