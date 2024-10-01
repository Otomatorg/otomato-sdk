import { CHAINS, rpcServices } from '../src/index.js';

const main = async () => {
    const chainId = CHAINS.ETHEREUM; // Or any other chain, e.g. CHAINS.MODE
    const tokenContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // Replace with your token address

    try {
        // Fetch token details using the SDK
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
