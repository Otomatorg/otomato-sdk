// Import necessary modules and initialize dotenv
import { Authorization, apiServices } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    // Set the API URL from environment variables
    if (!process.env.API_URL)
        return;

    apiServices.setUrl(process.env.API_URL);
    
    // Set authentication token
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDc1N0EwMDRiRTc2NmY3NDVmZDRDRDc1OTY2Q0Y2QzhCYjg0RkQ3YzEiLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3Mjc0NjY4MzcsIm5iZiI6MTcyNDg3MzAzNCwiaWF0IjoxNzI0ODc0ODM3LCJqdGkiOiIweGZiYzIzYTM1MmQxZWNhZWRmODc3NmI3ZDc5ZGFiNDg1N2E1MTM1MGUzNDZiNzlmNTEyZGE5MzYwYjcyYTVkYzciLCJjdHgiOnt9fQ.MHhjYTlmMDM2YjZkMDQzMDdjYWQ0OTg1ZDQxODgwMTU4NWExZTZkM2JhZmNkNTZmOWViYTJhYjI4ZWVhMTBjYTk0MDUxZDkwMTgxNjE4YzA1ZDA3NzQwZTg3OWE4M2M1Zjk2MmU2MWFlMzJhY2JiNTk5MDljNGIxMDIwMTY4ZWZiOTFj");

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