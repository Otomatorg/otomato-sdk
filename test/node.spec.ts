import { expect } from 'chai';
import { Node, Parameter } from '../src/index'; // Adjust the import path according to your project structure

const DEFAULT_PARAMETERS: Parameter[] = [
  { key: 'chainId', type: 'integer', description: 'Chain ID', value: null },
  { key: 'contractAddress', type: 'address', description: 'Contract Address', value: null }
];

describe('Node Class', () => {
  
  it('should create a node without coordinates', () => {
    const node = new Node({
      id: 1,
      name: 'Test Node',
      description: 'A node for testing',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });

    expect(node.position).to.be.undefined;
  });

  it('should create a node with coordinates', () => {
    const node = new Node({
      id: 2,
      name: 'Test Node with Coordinates',
      description: 'A node for testing with coordinates',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass',
      position: {x: 100, y: 200}
    });

    expect(node.position?.x).to.equal(100);
    expect(node.position?.y).to.equal(200);
  });

  it('should set and get coordinates correctly', () => {
    const node = new Node({
      id: 3,
      name: 'Test Node for Coordinates',
      description: 'A node for testing coordinate setting',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });

    node.setPosition(300, 400);
    expect(node.position?.x).to.equal(300);
    expect(node.position?.y).to.equal(400);
  });

  it('should create a node and set parameters correctly', () => {
    const node = new Node({
      id: 4,
      name: 'Test Node for Parameters',
      description: 'A node for testing parameter setting',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const params = node.getParameters();
    expect(params.chainId).to.equal(1);
    expect(params.contractAddress).to.equal("0x0000000000000000000000000000000000000000");
  });

  it('should be able to export a node as json without coordinates', () => {
    const node = new Node({
      id: 5,
      name: 'Test Node for JSON',
      description: 'A node for testing JSON export',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const json = node.toJSON();
    expect(json).to.deep.equal({
      id: 5,
      ref: node.getRef(),
      type: 'testClass',
      parameters: {
        chainId: 1,
        contractAddress: "0x0000000000000000000000000000000000000000"
      }
    });
  });

  it('should be able to export a node as json with coordinates', () => {
    const node = new Node({
      id: 6,
      name: 'Test Node for JSON with Coordinates',
      description: 'A node for testing JSON export with coordinates',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass',
      position: {x: 1, y: 2}
    });

    node.setChainId(1);
    node.setContractAddress("0x0000000000000000000000000000000000000000");

    const json = node.toJSON();
    expect(json).to.deep.equal({
      type: 'testClass',
      id: 6,
      ref: node.getRef(),
      parameters: {
        chainId: 1,
        contractAddress: "0x0000000000000000000000000000000000000000"
      },
      position: {x: 1, y: 2}
    });
  });

  it('should throw an error for invalid parameter type', () => {
    const node = new Node({
      id: 7,
      name: 'Test Node for Invalid Parameter Type',
      description: 'A node for testing invalid parameter type',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });
    expect(() => node.setParams("chainId", "invalid")).to.throw('Invalid type for parameter chainId. Expected integer.');
  });

  it('should throw an error for invalid address', () => {
    const node = new Node({
      id: 8,
      name: 'Test Node for Invalid Address',
      description: 'A node for testing invalid address',
      parameters: DEFAULT_PARAMETERS,
      class: 'testClass'
    });
    expect(() => node.setParams("contractAddress", "invalid_address")).to.throw('Invalid type for parameter contractAddress. Expected address.');
  });
});
