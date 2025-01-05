import { CHAINS, rpcServices } from '../../src/index.js';

const main = async () => {
    const chainId = CHAINS.MODE; // Or any other chain, e.g. CHAINS.MODE
    const tokenContractAddress = '0x18470019bF0E94611f15852F7e93cf5D65BC34CA'; // Replace with your token address

    try {
        rpcServices.setRPCs({
            34443: 'https://mainnet.mode.network/', // Chain 43334 (Mode network mainnet RPC)
        });
        /*rpcServices.setRPCsFromTMS({
            MODE_HTTPS_PROVIDER: 'https://mainnet.mode.network/', // Chain 43334 (Mode network mainnet RPC)
        });*/
        const tokenDetails = await rpcServices.getTokenDetails(chainId, tokenContractAddress);

        // Log the token details: contract address, symbol, name, and decimals
        console.log(`Token Address: ${tokenDetails.contractAddress}`);
        console.log(`Token Symbol: ${tokenDetails.symbol}`);
        console.log(`Token Name: ${tokenDetails.name}`);
        console.log(`Token Decimals: ${tokenDetails.decimals}`);
    } catch (error: any) {
        console.error('Error fetching token details:', error.message);
    }
};

main();
