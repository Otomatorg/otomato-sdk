import { expect } from 'chai';
import { SessionKeyPermission } from '../src/models/SessionKeyPermission'; // Adjust the import path according to your project structure

describe('SessionKeyPermission Class', () => {
  it('should create a SessionKeyPermission instance with approved targets', () => {
    const approvedTargets = ['target1', 'target2'];
    const permission = new SessionKeyPermission(approvedTargets);

    expect(permission.approvedTargets).to.deep.equal(approvedTargets);
  });

  it('should replace placeholders in approved targets correctly', () => {
    const approvedTargets = ['$paramA/endpoint', 'another/$paramB'];
    const permission = new SessionKeyPermission(approvedTargets);

    permission.fill('paramA', 'valueA');
    permission.fill('paramB', 'valueB');

    expect(permission.approvedTargets).to.deep.equal(['valueA/endpoint', 'another/valueB']);
  });

  it('should throw an error when unresolved placeholders are present in approved targets during toJSON', () => {
    const approvedTargets = ['$paramA/endpoint', 'another/$paramB'];
    const permission = new SessionKeyPermission(approvedTargets);

    expect(() => permission.toJSON()).to.throw('Approved targets contain unresolved placeholders.');
  });

  it('should convert to JSON correctly when no placeholders are present', () => {
    const approvedTargets = ['valueA/endpoint', 'another/valueB'];
    const permission = new SessionKeyPermission(approvedTargets);

    const json = permission.toJSON();

    expect(json).to.deep.equal({ approvedTargets });
  });

  it('should create a SessionKeyPermission instance from JSON', () => {
    const json = { approvedTargets: ['valueA/endpoint', 'another/valueB'] };
    const permission = SessionKeyPermission.fromJSON(json);

    expect(permission.approvedTargets).to.deep.equal(json.approvedTargets);
  });

  it('should throw an error when fromJSON is called with invalid data', () => {
    const invalidJson = { approvedTargets: 'not_an_array' };

    expect(() => SessionKeyPermission.fromJSON(invalidJson)).to.throw('Invalid JSON object for SessionKeyPermission');
  });
});