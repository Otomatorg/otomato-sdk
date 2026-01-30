import { Workflow, apiServices } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Load an existing workflow by ID
    const workflowId = "c4d029b4-4cb2-4b9d-b63b-e353d04c5053";
    const workflow = await new Workflow().load(workflowId);

    console.log("Workflow loaded:", workflow.name);
    console.log("Current state:", workflow.state);

    // Stop the workflow
    const result = await workflow.stop();

    if (result.success) {
        console.log("Workflow stopped successfully");
        console.log("New state:", workflow.state);
    } else {
        console.log("Failed to stop workflow:", result.error);
    }
}

main();
