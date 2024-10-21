import { expect } from 'chai';
import { ethers } from 'ethers';
import {rpcServices} from '../src/services/RpcServices';
import { getToken } from '../src';

// Token contract address for testing (replace with a real token on chain 43334)
const tokenContractAddress = '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB'; // Replace with actual contract address

// Set RPCs for testing
rpcServices.setRPCs({
    34443: 'https://mainnet.mode.network/', // Chain 43334 (Mode network mainnet RPC)
});

describe('RPCServices', () => {
    describe('getTokenDetails', async function() {
    this.timeout(10000);
    it('should fetch token details (decimals, name, symbol) from the blockchain', async () => {
            // Call the getTokenDetails function
            const token = await rpcServices.getTokenDetails(34443, tokenContractAddress);

            // Expectations: These should be based on the actual token's attributes
            expect(token).to.have.property('contractAddress', tokenContractAddress);
            expect(token).to.have.property('decimals', BigInt(18));
            expect(token).to.have.property('symbol', 'SMD');
            expect(token).to.have.property('name', 'Swap Mode');
        });

        it('should throw an error if the token is not found on the chain', async () => {
            // Use a non-existent token contract address
            const invalidTokenAddress = '0x000000000000000000000000000000000000dead';

            try {
                await rpcServices.getTokenDetails(34443, invalidTokenAddress);
            } catch (error: any) {
                expect(error.message).to.include('Error fetching token details');
            }
        });

        it('should throw an error if the chainId does not have an RPC URL', async () => {
            const missingChainId = 99999; // A chainId that hasn't been configured with an RPC URL

            try {
                await rpcServices.getTokenDetails(missingChainId, tokenContractAddress);
            } catch (error: any) {
                expect(error.message).to.include(`No RPC URL configured for chain ID ${missingChainId}`);
            }
        });
    });
});

describe('RPCServices - integrations', () => {
    describe('getToken', () => {
        it('should fetch token details (decimals, name, symbol) from the blockchain', async () => {
            // Call the getTokenDetails function
            const token = await getToken(34443, tokenContractAddress);

            // Expectations: These should be based on the actual token's attributes
            expect(token).to.have.property('contractAddress', tokenContractAddress);
            expect(token).to.have.property('decimals', BigInt(18));
            expect(token).to.have.property('symbol', 'SMD');
            expect(token).to.have.property('name', 'Swap Mode');
        });

        it('should throw an error if the token is not found on the chain', async () => {
            // Use a non-existent token contract address
            const invalidTokenAddress = '0x000000000000000000000000000000000000dead';

            try {
                await getToken(34443, invalidTokenAddress);
            } catch (error: any) {
                expect(error.message).to.include('Token with contract address 0x000000000000000000000000000000000000dead not found on chain 34443');
            }
        });

        it('should throw an error if the chainId does not have an RPC URL', async () => {
            const missingChainId = 99999; // A chainId that hasn't been configured with an RPC URL

            try {
                await getToken(missingChainId, tokenContractAddress);
            } catch (error: any) {
                expect(error.message).to.include(`Unsupported chain: 99999`);
            }
        });
    });
});

