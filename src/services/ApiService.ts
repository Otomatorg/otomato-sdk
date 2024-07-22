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
  private auth: string | null = null;

  setAuth(auth: string) {
    this.auth = auth;
  }

  async post(url: string, data: any) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.post(url, data, { headers });
  }

  async patch(url: string, data: any) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.patch(url, data, { headers });
  }

  async get(url: string) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    const response = await axiosInstance.get(url, { headers });
    return response.data;
  }

  async delete(url: string) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.delete(url, { headers });
  }

  async generateLoginPayload(address: string, chainId: number) {
    const headers = { 'Content-Type': 'application/json' };
    const response = await axiosInstance.post('/auth/generate-payload', { address, chainId }, { headers });
    return response.data;
  }

  async getToken(loginPayload: any, signature: string) {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      payload: loginPayload,
      signature,
    };
    const response = await axiosInstance.post('/auth/token', body, { headers });
    const token = response.data.token;

    return { token };
  }

  async verifyToken(token: string) {
    const headers = { 'Content-Type': 'application/json' };
    const response = await axiosInstance.post('/auth/verify-token', { token }, { headers });
    return response.data;
  }

  async getWorkflowsOfUser() {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    const response = await axiosInstance.get('/workflows', { headers });
    return response.data;
  }
}

export const apiServices = new ApiServices();