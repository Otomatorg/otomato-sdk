import { ethers } from 'ethers';

export function validateType(expectedType: string, value: any): boolean {
    switch (expectedType) {
        case 'int':
        case 'integer':
        case 'uint256':
        case 'int256':
            return Number.isInteger(value);
        case 'address':
            return typeof value === 'string' && isAddress(value);
        case 'float':
            return typeof value === 'number';
        case 'url':
            return typeof value === 'string' && isValidUrl(value);
        case 'phone_number':
            return typeof value === 'string' && isValidPhoneNumber(value);
        case 'paragraph':
            return typeof value === 'string';
        case 'logic_operator':
            const validOperators = new Set(['<', '>', '<=', '>=', '==']);
            return typeof value === 'string' && validOperators.has(value);
        case 'any':
            return true;
        default:
            return false;
    }
}

export function isAddress(value: string): boolean {
    return ethers.isAddress(value);
}

export function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch (_) {
        return false;
    }
}

export function isValidPhoneNumber(value: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(value);
}