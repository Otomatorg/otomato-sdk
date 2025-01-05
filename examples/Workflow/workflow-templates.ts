import { WORKFLOW_TEMPLATES, WORKFLOW_TEMPLATES_TAGS, Workflow, apiServices } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const workflow = await WORKFLOW_TEMPLATES[7].createWorkflow()

    console.log(JSON.stringify(workflow.toJSON()));

    const status = await workflow.create();
    console.log(status);

    if (!status.success)
        throw new Error("The workflow wasn't created");

    console.log(workflow.id);

    const workflow2 = await new Workflow().load(workflow.id as string);
    console.log(workflow2.nodes[0].parameters);
    console.log(workflow2.nodes[1].parameters);
}

main()