import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_GRIEVANCE_SERVICE_URL || 'http://localhost:3012';

export const grievanceService = {
  async getGrievances() {
    const response = await axios.get(`${API_URL}/grievances`);
    return response.data;
  },

  async createGrievance(data: any) {
    const response = await axios.post(`${API_URL}/grievances`, data);
    return response.data;
  },

  async getStatus(id: string) {
    const response = await axios.get(`${API_URL}/grievances/${id}`);
    return response.data;
  },
};
