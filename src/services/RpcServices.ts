import { ethers } from 'ethers';
import { Token } from '../constants/tokens';

class RPCServices {
  private rpcUrls: { [chainId: number]: string } = {}; // Store the RPC URLs

  // Function to set RPC URLs
  setRPCs(rpcs: { [chainId: number]: string }): void {
    this.rpcUrls = { ...this.rpcUrls, ...rpcs };
  }

  setRPCsFromTMS(env: { [key: string]: string }) {
    if (env.MODE_HTTPS_PROVIDER) {
      this.rpcUrls[43334] = env.MODE_HTTPS_PROVIDER; // Chain ID 43334 is for Mode network
    }
    if (env.INFURA_HTTPS_PROVIDER) {
      this.rpcUrls[1] = env.INFURA_HTTPS_PROVIDER; // Chain ID 1 is for Ethereum mainnet
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

    // Create a provider using ethers.js
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Define the contract ABI for the read-only functions (decimals, name, symbol)
    const erc20ABI = [
      'function decimals() view returns (uint8)',
      'function name() view returns (string)',
      'function symbol() view returns (string)',
    ];

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, erc20ABI, provider);

    // Fetch the decimals, name, and symbol in parallel using Promise.all
    try {
      const [decimals, name, symbol] = await Promise.all([
        contract.decimals(),
        contract.name(),
        contract.symbol(),
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