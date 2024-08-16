import { expect } from 'chai';
import { Action, Node, Parameter } from '../src/index'; // Adjust the import path according to your project structure

const DEFAULT_PARAMETERS: Parameter[] = [
  { key: 'chainId', type: 'integer', description: 'Chain ID', value: null },
  { key: 'contractAddress', type: 'address', description: 'Contract Address', value: null }
];

const DEFAULT_OUTPUTS = {
  value: 'uint256',
  from: 'address',
  to: 'address'
};

describe('Node Class', () => {

  it('should create a node without coordinates', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node',
      description: 'A node for testing',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });

    expect(node.position).to.be.undefined;
  });

  it('should create a node with coordinates', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node with Coordinates',
      description: 'A node for testing with coordinates',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      position: { x: 100, y: 200 },
      image: 'a',
    });

    expect(node.position?.x).to.equal(100);
    expect(node.position?.y).to.equal(200);
  });

  it('should set and get coordinates correctly', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for Coordinates',
      description: 'A node for testing coordinate setting',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });

    node.setPosition(300, 400);
    expect(node.position?.x).to.equal(300);
    expect(node.position?.y).to.equal(400);
  });

  it('should create a node and set parameters correctly', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for Parameters',
      description: 'A node for testing parameter setting',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const params = node.getParameters();
    expect(params.chainId).to.equal(1);
    expect(params.contractAddress).to.equal("0x0000000000000000000000000000000000000000");
  });

  it('should get the correct outputs', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for Outputs',
      description: 'A node for testing outputs',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });

    const outputs = node.getOutputs();
    expect(outputs).to.deep.equal(DEFAULT_OUTPUTS);
  });

  it('should be able to export a node as json without coordinates', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for JSON',
      description: 'A node for testing JSON export',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const json = node.toJSON();
    expect(json).to.deep.equal({
      blockId: 100001,
      id: null,
      state: 'inactive',
      ref: node.getRef(),
      type: 'action',
      parameters: {
        chainId: 1,
        contractAddress: "0x0000000000000000000000000000000000000000"
      },
    });
  });

  it('should be able to export a node as json with coordinates', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for JSON with Coordinates',
      description: 'A node for testing JSON export with coordinates',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      position: { x: 1, y: 2 },
      image: 'a',
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const json = node.toJSON();
    expect(json).to.deep.equal({
      type: 'action',
      blockId: 100001,
      id: null,
      state: 'inactive',
      ref: node.getRef(),
      parameters: {
        chainId: 1,
        contractAddress: "0x0000000000000000000000000000000000000000"
      },
      position: { x: 1, y: 2 }
    });
  });

  it('should throw an error for invalid parameter type', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for Invalid Parameter Type',
      description: 'A node for testing invalid parameter type',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });
    expect(() => node.setParams("chainId", "invalid")).to.throw('Invalid type for parameter chainId. Expected integer.');
  });

  it('should throw an error for invalid address', () => {
    const node = new Action({
      blockId: 100001,
      name: 'Test Node for Invalid Address',
      description: 'A node for testing invalid address',
      parameters: DEFAULT_PARAMETERS,
      output: DEFAULT_OUTPUTS,
      image: 'a',
    });
    expect(() => node.setParams("contractAddress", "invalid_address")).to.throw('Invalid type for parameter contractAddress. Expected address.');
  });
});