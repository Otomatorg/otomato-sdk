import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getToken, Edge, apiServices } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    //const workflows = await apiServices.getWorkflowsOfUser();
    //console.log(workflows);
    // const workflow = await new Workflow().load(workflows[12].id);
    const workflow = await new Workflow().load("df89b574-2139-4750-ba15-5886aac46ba3");
    console.log(JSON.stringify(workflow));
}

main();
