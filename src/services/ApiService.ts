import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'https://api.otomato.xyz/api',
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

  setUrl(baseUrl: string) {
    axiosInstance.defaults.baseURL = baseUrl;
  }

  async post(url: string, data: any) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.post(url, data, { headers });
  }

  async patch(url: string, data: any) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.patch(url, data, { headers });
  }

  async put(url: string, data: any) {
    const headers = this.auth ? { 'Authorization': this.auth } : {};
    return await axiosInstance.put(url, data, { headers });
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

  async generateLoginPayload(address: string, chainId: number, referralCode: string, ownerWalletAddress: string) {
    const headers = { 'Content-Type': 'application/json' };
    const response = await axiosInstance.post('/auth/generate-payload', { address, chainId, referralCode, ownerWalletAddress }, { headers });
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

  async getWorkflowsOfUser(offset?: number, limit?: number, isActive?: boolean, query?: string) {
    if (!this.auth) {
      throw new Error('Authorization token is required');
    }
  
    const headers = { 'Authorization': this.auth };
  
    // Set defaults for offset and limit if not provided
    const finalOffset = offset ?? 0;
    const finalLimit = limit ?? 8;
  
    const params = new URLSearchParams();
    params.append('offset', finalOffset.toString());
    params.append('limit', finalLimit.toString());
  
    // Add isActive filter if provided
    if (isActive !== undefined) {
      params.append('isActive', isActive.toString());
    }
  
    // add a query to filter by name
    if (query) {
      params.append('q', query);
    }
  
    const url = `/workflows?${params.toString()}`;
    const response = await axiosInstance.get(url, { headers });
    return response.data;
  }

  async getSessionKeyPermissions(workflowId: string) {
    if (!this.auth) {
      throw new Error('Authorization token is required');
    }

    try {
      const url = `/workflows/${workflowId}/verify-contracts`;
      const headers = { Authorization: this.auth };

      const response = await axiosInstance.post(url, {}, { headers });

      return response.data; // Return the data from the response
    } catch (error: any) {
      console.error('Error verifying contracts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to verify contracts');
    }
  }
}

export const apiServices = new ApiServices();