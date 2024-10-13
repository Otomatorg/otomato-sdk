// Import necessary modules and initialize dotenv
import { Authorization, apiServices } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    try {
        // Verifying contracts that have been authorized
        const verifyResult = await Authorization.verifyContracts("34443", "0x9", ["0x1", "0x2"]);
        console.log('Verify Result:', verifyResult);

        // Verifying contracts that have been authorized
        const verifyResult2 = await Authorization.verifyContracts("1", "0x9", ["0x1", "0x2"]);
        console.log('Verify Result2:', verifyResult2);

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();