import axios from 'axios';
import jwt from 'jsonwebtoken';

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
    console.log(JSON.stringify(data));
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    const response = await axiosInstance.post(url, data, { headers });
    return response.data;
  }

  async get(url: string) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    const response = await axiosInstance.get(url, { headers });
    return response.data;
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
    
    const cookie = response.headers['set-cookie'];
    const token = response.data.token;
    
    console.log('cookie:', cookie);
    console.log('token:', token);

    // Decode the JWT token
    const decodedToken: any = jwt.decode(token, { complete: true });
    console.log('decodedToken:', decodedToken);

    return { token, cookie, decodedToken };
  }

  async verifyToken(token: string) {
    const headers = { 'Content-Type': 'application/json' };
    const response = await axiosInstance.post('/auth/verify-token', { token }, { headers });
    return response.data;
  }
}

export const apiServices = new ApiServices();