// networkService.ts
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'http://localhost:3040/api',
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS
});

export const apiServices = {
  async post(endpoint: string, data: any) {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Network request failed', error);
      throw error;
    }
  },

  // Add other HTTP methods if needed
  // async get(endpoint: string) { ... }
  // async put(endpoint: string, data: any) { ... }
  // async delete(endpoint: string) { ... }
};
