// Import the apiServices instance
import { apiServices } from '../services/ApiService.js';

// Define the Authorization class with static methods
export class Authorization {
  /**
   * Verify if the contracts are authorized.
   * 
   * @param chainId - The chain ID of the blockchain network.
   * @param sessionKeyAddress - The session key address to verify.
   * @param contractAddresses - The list of contract addresses to verify.
   * @returns A promise resolving to the verification result.
   */
  static async verifyContracts(
    chainId: string,
    sessionKeyAddress: string,
    contractAddresses: string[]
  ): Promise<{ isValid: boolean; diff?: {}; error?: string }> {
    const payload = {
      chainId,
      sessionKeyAddress,
      contractAddresses
    };
  
    try {
      const response = await apiServices.post('/auth/verify-contracts', payload);
  
      if (response.status === 200) {
        return { isValid: true };
      } else {
        return { isValid: false, diff: response.data || 'Unknown error' };
      }
    } catch (error: any) {
      // Extract response body from error if it exists
      if (error.response) {
        return error.response.data;
      }
  
      // Handle network errors or any other type of error
      return { isValid: false, error: error.message || 'Unknown error' };
    }
  }
}