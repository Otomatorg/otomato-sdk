import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getToken, Edge, apiServices } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    const workflows = await apiServices.getWorkflowsOfUser(0, 8, false, "My");
    console.log(workflows.meta)
    console.log(workflows.data.map((i: Workflow) => i.name));
    // const workflow = await new Workflow().load(workflows.data[1].id);
    // console.log(workflow);
}

main();
