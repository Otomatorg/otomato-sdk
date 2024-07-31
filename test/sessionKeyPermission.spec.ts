import { expect } from 'chai';
import { SessionKeyPermission } from '../src/models/SessionKeyPermission'; // Adjust the import path according to your project structure

describe('SessionKeyPermission Class', () => {

  it('should create a SessionKeyPermission instance with approved targets, labels, and labels not authorized', () => {
    const approvedTargets = ['target1', 'target2'];
    const label = ['Label1'];
    const labelNotAuthorized = ['NotAuthorizedLabel'];

    const permission = new SessionKeyPermission({ approvedTargets, label, labelNotAuthorized });

    expect(permission.approvedTargets).to.deep.equal(approvedTargets);
    expect(permission.label).to.deep.equal(label);
    expect(permission.labelNotAuthorized).to.deep.equal(labelNotAuthorized);
  });

  it('should create a SessionKeyPermission instance with empty arrays when no parameters are passed', () => {
    const permission = new SessionKeyPermission();

    expect(permission.approvedTargets).to.deep.equal([]);
    expect(permission.label).to.deep.equal([]);
    expect(permission.labelNotAuthorized).to.deep.equal([]);
  });

  it('should replace placeholders in approved targets, labels, and labels not authorized correctly', () => {
    const approvedTargets = ['$paramA/endpoint', 'another/$paramB'];
    const label = ['$paramA label', 'label $paramB'];
    const labelNotAuthorized = ['$paramA not authorized', 'not authorized $paramB'];

    const permission = new SessionKeyPermission({ approvedTargets, label, labelNotAuthorized });

    permission.fill('paramA', 'valueA');
    permission.fill('paramB', 'valueB');

    expect(permission.approvedTargets).to.deep.equal(['valueA/endpoint', 'another/valueB']);
    expect(permission.label).to.deep.equal(['valueA label', 'label valueB']);
    expect(permission.labelNotAuthorized).to.deep.equal(['valueA not authorized', 'not authorized valueB']);
  });

  it('should throw an error when unresolved placeholders are present during toJSON', () => {
    const approvedTargets = ['$paramA/endpoint'];
    const label = ['Label $paramA'];
    const labelNotAuthorized = ['Not authorized $paramB'];

    const permission = new SessionKeyPermission({ approvedTargets, label, labelNotAuthorized });

    expect(() => permission.toJSON()).to.throw('Approved targets contain unresolved placeholders.');
  });

  it('should convert to JSON correctly when no placeholders are present', () => {
    const approvedTargets = ['valueA/endpoint'];
    const label = ['Label'];
    const labelNotAuthorized = ['Not authorized'];

    const permission = new SessionKeyPermission({ approvedTargets, label, labelNotAuthorized });

    const json = permission.toJSON();

    expect(json).to.deep.equal({
      approvedTargets,
      label,
      labelNotAuthorized
    });
  });

  it('should create a SessionKeyPermission instance from JSON', () => {
    const json = {
      approvedTargets: ['valueA/endpoint'],
      label: ['Label'],
      labelNotAuthorized: ['Not authorized']
    };
    const permission = SessionKeyPermission.fromJSON(json);

    expect(permission.approvedTargets).to.deep.equal(json.approvedTargets);
    expect(permission.label).to.deep.equal(json.label);
    expect(permission.labelNotAuthorized).to.deep.equal(json.labelNotAuthorized);
  });

  it('should throw an error when fromJSON is called with invalid data', () => {
    const invalidJson = { approvedTargets: 'not_an_array' };

    expect(() => SessionKeyPermission.fromJSON(invalidJson)).to.throw('Invalid JSON object for SessionKeyPermission');
  });

  it('should merge two SessionKeyPermission instances correctly', () => {
    const permission1 = new SessionKeyPermission({
      approvedTargets: ['target1'],
      label: ['Label1'],
      labelNotAuthorized: ['NotAuthorizedLabel1']
    });

    const permission2 = new SessionKeyPermission({
      approvedTargets: ['target2'],
      label: ['Label2'],
      labelNotAuthorized: ['NotAuthorizedLabel2']
    });

    permission1.merge(permission2);

    expect(permission1.approvedTargets).to.deep.equal(['target1', 'target2']);
    expect(permission1.label).to.deep.equal(['Label1', 'Label2']);
    expect(permission1.labelNotAuthorized).to.deep.equal(['NotAuthorizedLabel1', 'NotAuthorizedLabel2']);
  });
});