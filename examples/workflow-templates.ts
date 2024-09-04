import { WORKFLOW_TEMPLATES, WORKFLOW_TEMPLATES_TAGS, Workflow, apiServices } from '../src/index.js';


// console.log(workflow)
// console.log(WORKFLOW_TEMPLATES_TAGS)
const main = async () => {
    const workflow = await WORKFLOW_TEMPLATES[2].createWorkflow()
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDg3RkU4YjRmMkZlODM3MGY2Y0M5YTk2MzQ0MmYwN0IwMmY0OTA5QTciLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3MjMzODMxOTksIm5iZiI6MTcyMDc4OTM5OSwiaWF0IjoxNzIwNzkxMTk5LCJqdGkiOiIweDY4ZDkxOWEyMGZiYjIyNDUwZDZmOTFjMzM2ZTBmYjBjMmYyYTc3MmU3Zjg4NWU1ZjRmNzg1NTM2ZGIyYTY5YTAiLCJjdHgiOnt9fQ.MHgyOTM1NTM3MWYwOWM1YzllNWE3YjI4MjVkZTNjMDljZTkwMTQ3OTQwZmU1ZWRlMjM5YTk0MmFjYTQ5YTcwZWI0MGJlNmJiZDk2MDA4ZTIxMzJmNGM3ZTVlZGIzZDZiZjYyMDE4Mzc1MzUwMTRmNTc0ODM0ZDk4YWU3NDQwNDQzOTFi");

    const status = await workflow.create();

    if (!status.success)
        throw new Error("The workflow wasn't created");

    console.log(workflow.id);

    const workflow2 = await new Workflow().load(workflow.id as string);
    console.log(workflow2.nodes[0].parameters);
    console.log(workflow2.nodes[1].parameters);

}

main()