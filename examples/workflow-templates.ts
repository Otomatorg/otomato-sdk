import { WORKFLOW_TEMPLATES, WORKFLOW_TEMPLATES_TAGS, Workflow, apiServices } from '../src/index.js';


// console.log(workflow)
// console.log(WORKFLOW_TEMPLATES_TAGS)
const main = async () => {
    const workflow = await WORKFLOW_TEMPLATES[2].createWorkflow()
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDc1N0EwMDRiRTc2NmY3NDVmZDRDRDc1OTY2Q0Y2QzhCYjg0RkQ3YzEiLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3Mjc0NjY4MzcsIm5iZiI6MTcyNDg3MzAzNCwiaWF0IjoxNzI0ODc0ODM3LCJqdGkiOiIweGZiYzIzYTM1MmQxZWNhZWRmODc3NmI3ZDc5ZGFiNDg1N2E1MTM1MGUzNDZiNzlmNTEyZGE5MzYwYjcyYTVkYzciLCJjdHgiOnt9fQ.MHhjYTlmMDM2YjZkMDQzMDdjYWQ0OTg1ZDQxODgwMTU4NWExZTZkM2JhZmNkNTZmOWViYTJhYjI4ZWVhMTBjYTk0MDUxZDkwMTgxNjE4YzA1ZDA3NzQwZTg3OWE4M2M1Zjk2MmU2MWFlMzJhY2JiNTk5MDljNGIxMDIwMTY4ZWZiOTFj");

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