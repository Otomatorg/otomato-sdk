import { expect } from 'chai';
import { convertWFJSONToCode } from '../src/utils/jsonToWf';

describe('convertWFJSONToCode', () => {
    it('should convert workflow JSON to code string', () => {
        const inputJson = {
            id: "test-id",
            name: "Test Workflow",
            state: "inactive",
            dateCreated: "2025-09-09T08:48:04.510Z",
            dateModified: "2025-09-09T08:58:40.538Z",
            executionId: null,
            agentId: null,
            nodes: [
                {
                    id: "trigger-node-id",
                    ref: "6",
                    blockId: 35,
                    type: "trigger",
                    state: "inactive",
                    isOptional: null,
                    parameters: {
                        contract: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
                        rarityCondition: "lte",
                        rarity: 5000,
                        price: 30,
                        traits: "{\"Background\":[\"Blue\"],\"Body\":[\"Pineapple Suit\"]}"
                    },
                    frontendHelpers: {},
                    position: {
                        x: 400,
                        y: 120
                    }
                },
                {
                    id: "action-node-id",
                    ref: "10",
                    blockId: 100018,
                    type: "action",
                    state: "inactive",
                    isOptional: null,
                    parameters: {
                        protectedData: "0xa0745746a3e664540b79dae6992cfd8088a0926f",
                        content: "A Pudgy Penguin has just been listed."
                    },
                    frontendHelpers: {},
                    position: {
                        x: 400,
                        y: 240
                    }
                }
            ],
            edges: [
                {
                    id: "edge-id",
                    source: "6",
                    target: "10"
                }
            ],
            notes: [],
            settings: null
        };

        const codeString = convertWFJSONToCode(inputJson);
        expect(codeString).to.be.a('string');
        expect(codeString).to.include('new Trigger');
        expect(codeString).to.include('new Action');
        expect(codeString).to.include('new Edge');
        expect(codeString).to.include('new Workflow');
        expect(codeString).to.include('setParams');
        expect(codeString).to.include('setPosition');
    });
});