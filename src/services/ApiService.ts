// networkService.ts
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'https://staging-api.otomato.xyz/api',
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS
});

class ApiServices {
  private cookie: string | null = null;

  setCookie(cookie: string) {
    this.cookie = `token=${cookie}`;
  }

  async post(url: string, data: any) {
    const headers = this.cookie ? { 'Cookie': this.cookie } : {};
    const response = await axiosInstance.post(url, data, { headers });
    return response.data;
  }

  async get(url: string) {
    const headers = this.cookie ? { 'Cookie': this.cookie } : {};
    const response = await axiosInstance.get(url, { headers });
    return response.data;
  }

  // You can add other methods (get, put, delete) similarly
}

export const apiServices = new ApiServices();