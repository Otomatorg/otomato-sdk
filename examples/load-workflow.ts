import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getToken, Edge, apiServices } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// console.log(workflow)
// console.log(WORKFLOW_TEMPLATES_TAGS)
const main = async () => {
    if (!process.env.API_URL)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDc1N0EwMDRiRTc2NmY3NDVmZDRDRDc1OTY2Q0Y2QzhCYjg0RkQ3YzEiLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3Mjc0NjY4MzcsIm5iZiI6MTcyNDg3MzAzNCwiaWF0IjoxNzI0ODc0ODM3LCJqdGkiOiIweGZiYzIzYTM1MmQxZWNhZWRmODc3NmI3ZDc5ZGFiNDg1N2E1MTM1MGUzNDZiNzlmNTEyZGE5MzYwYjcyYTVkYzciLCJjdHgiOnt9fQ.MHhjYTlmMDM2YjZkMDQzMDdjYWQ0OTg1ZDQxODgwMTU4NWExZTZkM2JhZmNkNTZmOWViYTJhYjI4ZWVhMTBjYTk0MDUxZDkwMTgxNjE4YzA1ZDA3NzQwZTg3OWE4M2M1Zjk2MmU2MWFlMzJhY2JiNTk5MDljNGIxMDIwMTY4ZWZiOTFj");
    //const workflows = await apiServices.getWorkflowsOfUser();
    //console.log(workflows);
    // const workflow = await new Workflow().load(workflows[12].id);
    const workflow = await new Workflow().load("c69be4fb-252f-438f-813c-ed13fa22c86f");
    console.log(JSON.stringify(workflow));
}

main();
