import { expect } from 'chai';
import { validateType, isAddress, isValidUrl, isValidPhoneNumber } from '../src/utils/typeValidator';
import { ethers } from 'ethers';

describe('Type Validator Utility Functions', () => {

    describe('validateType', () => {
        it('should validate boolean values', () => {
            expect(validateType('bool', true)).to.be.true;
            expect(validateType('boolean', false)).to.be.true;
            expect(validateType('bool', 'true')).to.be.false;
        });

        it('should validate integer values', () => {
            expect(validateType('integer', 10)).to.be.true;
            expect(validateType('int256', 10)).to.be.true;
            expect(validateType('int8', 127)).to.be.true;
            expect(validateType('int8', 128)).to.be.false;
            expect(validateType('int8', -128)).to.be.true;
            expect(validateType('int8', -129)).to.be.false;
        });

        it('should validate unsigned integer values', () => {
            expect(validateType('uint256', 10)).to.be.true;
            expect(validateType('uint8', 255)).to.be.true;
            expect(validateType('uint8', 256)).to.be.false;
            expect(validateType('uint8', -1)).to.be.false;
        });

        it('should validate address values', () => {
            expect(validateType('address', '0x0000000000000000000000000000000000000000')).to.be.true;
            expect(validateType('address', 'invalid_address')).to.be.false;
        });

        it('should validate float values', () => {
            expect(validateType('float', 10.5)).to.be.true;
            expect(validateType('fixed', 10.5)).to.be.true;
            expect(validateType('float', '10.5')).to.be.false;
        });

        it('should validate URL values', () => {
            expect(validateType('url', 'https://example.com')).to.be.true;
            expect(validateType('url', 'invalid_url')).to.be.false;
        });

        it('should validate phone number values', () => {
            expect(validateType('phone_number', '+1234567890')).to.be.true;
            expect(validateType('phone_number', '12345')).to.be.false;
            expect(validateType('phone_number', '+11234567890')).to.be.true;
            expect(validateType('phone_number', '+447911123456')).to.be.true;
            // fixme: it should not accept it
            // expect(validateType('phone_number', '001234567890')).to.be.false;
        });

        it('should validate paragraph values', () => {
            expect(validateType('paragraph', 'This is a test paragraph.')).to.be.true;
            expect(validateType('paragraph', 12345)).to.be.false;
        });

        it('should validate logic operators', () => {
            expect(validateType('logic_operator', 'gte')).to.be.true;
            expect(validateType('logic_operator', '>')).to.be.false;
            expect(validateType('logic_operator', 'invalid_operator')).to.be.false;
        });

        it('should validate any type', () => {
            expect(validateType('any', 'any_value')).to.be.true;
            expect(validateType('any', 12345)).to.be.true;
            expect(validateType('any', true)).to.be.true;
        });

        // New tests for percentage validation
        it('should validate percentage values between 0 and 100', () => {
            expect(validateType('percentage', 0)).to.be.true;
            expect(validateType('percentage', 50)).to.be.true;
            expect(validateType('percentage', 100)).to.be.true;
            expect(validateType('percentage', -1)).to.be.false;
            expect(validateType('percentage', 101)).to.be.false;
            expect(validateType('percentage', '50')).to.be.false;
        });
    });
});