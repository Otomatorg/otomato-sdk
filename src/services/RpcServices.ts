import { ethers } from 'ethers';
import { Token } from '../constants/tokens.js';
import { CHAINS } from '../constants/chains.js';

class RPCServices {
  private rpcUrls: { [chainId: number]: string } = {}; // Store the RPC URLs

  // Function to set RPC URLs
  setRPCs(rpcs: { [chainId: number]: string }): void {
    this.rpcUrls = { ...this.rpcUrls, ...rpcs };
  }

  setRPCsFromTMS(env: { [key: string]: string }) {
    if (env.MODE_HTTPS_PROVIDER) {
      this.rpcUrls[CHAINS.MODE] = env.MODE_HTTPS_PROVIDER;
    }
    if (env.INFURA_HTTPS_PROVIDER) {
      this.rpcUrls[CHAINS.ETHEREUM] = env.INFURA_HTTPS_PROVIDER;
    }
  }

  // Function to get the RPC URL for a specific chainId
  getRPC(chainId: number): string {
    const rpcUrl = this.rpcUrls[chainId];
    if (!rpcUrl) {
      throw new Error(`No RPC URL configured for chain ID ${chainId}`);
    }
    return rpcUrl;
  }

  // Function to fetch token details from the blockchain
  async getTokenDetails(chainId: number, contractAddress: string): Promise<Token> {
    const rpcUrl = this.getRPC(chainId); // Get the RPC URL for the chain
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Define the contract ABI for the read-only functions (decimals, name, symbol)
    const erc20ABI = [
      'function decimals() view returns (uint8)',
      'function name() view returns (string)',
      'function symbol() view returns (string)',
    ];

    const contract = new ethers.Contract(contractAddress, erc20ABI, provider);

    const maxRetries = 3; // Max number of retries
    const retryDelay = (attempt: number) => Math.pow(2, attempt) * 1000; // Exponential backoff delay (in milliseconds)

    // Define a helper function to retry the RPC call
    const fetchWithRetry = async <T>(fn: () => Promise<T>, retries: number): Promise<T> => {
        let attempt = 0;
        while (attempt <= retries) {
            try {
                return await fn();
            } catch (error: any) {
                if (attempt === retries) {
                    throw new Error(`Error fetching token details ${contractAddress} on chain ${chainId}`);
                }
                attempt++;
                console.warn(`Attempt ${attempt} to fetch token details failed. Retrying in ${retryDelay(attempt)}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay(attempt)));
            }
        }
        throw new Error('Max retries exceeded');
    };

    // Fetch the decimals, name, and symbol with retries
    try {
      const [decimals, name, symbol] = await Promise.all([
        fetchWithRetry(() => contract.decimals(), maxRetries),
        fetchWithRetry(() => contract.name(), maxRetries),
        fetchWithRetry(() => contract.symbol(), maxRetries),
      ]);

      const token: Token = {
        contractAddress,
        symbol,
        name,
        decimals,
        image: null,
      };

      return token;
    } catch (error: any) {
      throw new Error(`Error fetching token details: ${error.message}`);
    }
}
}

// Export RPC services instance
export const rpcServices = new RPCServices();