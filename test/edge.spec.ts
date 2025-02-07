import { expect } from 'chai';
import { Edge, Action, ACTIONS, apiServices } from '../src/index';

describe('Edge Class', () => {

  it('should create an edge between two nodes', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    const edge = new Edge({ source: action1, target: action2 });

    expect(edge.source).to.equal(action1);
    expect(edge.target).to.equal(action2);
    expect(edge.id).to.be.null;
  });

  it('should set edge id correctly', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    const edge = new Edge({ id: 'edge-id-123', source: action1, target: action2 });

    expect(edge.id).to.equal('edge-id-123');
  });

  it('should serialize edge to JSON correctly', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    const edge = new Edge({ id: 'edge-id-123', source: action1, target: action2 });

    const json = edge.toJSON();
    expect(json).to.deep.equal({
      id: 'edge-id-123',
      source: action1.getRef(),
      target: action2.getRef(),
    });
  });

  it('should deserialize edge from JSON correctly', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    const nodes = [action1, action2];
    const json = {
      id: 'edge-id-123',
      source: action1.getRef(),
      target: action2.getRef(),
    };

    const deserializedEdge = Edge.fromJSON(json, nodes);

    expect(deserializedEdge.id).to.equal('edge-id-123');
    expect(deserializedEdge.source).to.equal(action1);
    expect(deserializedEdge.target).to.equal(action2);
  });

  it('should throw error when deserializing edge with non-existing nodes', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const nodes = [action1]; // Only one node in the nodes array
    const json = {
      id: null,
      source: action1.getRef(),
      target: 'nonexistent_ref',
    };

    expect(() => Edge.fromJSON(json, nodes)).to.throw('Edge refers to a non-existing node');
  });

  it('should throw error when creating edge without source or target', () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);

    expect(() => new Edge({ source: action1, target: null as any })).to.throw();
    expect(() => new Edge({ source: null as any, target: action1 })).to.throw();
  });

  it('should throw error when deleting edge without id', async () => {
    const action1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    const edge = new Edge({ source: action1, target: action2 });

    try {
      await edge.delete();
      expect.fail('Expected error was not thrown');
    } catch (error: any) {
      expect(error.message).to.equal('Cannot delete an edge without an ID.');
    }
  });

});