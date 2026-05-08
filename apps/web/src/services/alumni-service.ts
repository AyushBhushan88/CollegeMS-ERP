import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_ALUMNI_SERVICE_URL || 'http://localhost:3013';

export const alumniService = {
  async getDirectory() {
    const response = await axios.get(`${API_URL}/alumni`);
    return response.data;
  },

  async getProfile(id: string) {
    const response = await axios.get(`${API_URL}/alumni/${id}`);
    return response.data;
  },
};
