import { ethers } from 'ethers';

export function validateType(expectedType: string, value: any): boolean {
    switch (expectedType) {
        case 'bool':
        case 'boolean':
            return typeof value === 'boolean';
        case 'chainId':
        case 'integer':
            return Number.isInteger(value) || typeof value === 'bigint';
        case 'int8': case 'int16': case 'int32': case 'int64': case 'int128': case 'int256':
            return (Number.isInteger(value) || typeof value === 'bigint') && isIntInRange(value, parseInt(expectedType.replace('int', '')));
        case 'uint8': case 'uint16': case 'uint32': case 'uint64': case 'uint128': case 'uint256':
            return (Number.isInteger(value) || typeof value === 'bigint') && isUintInRange(value, parseInt(expectedType.replace('uint', '')));
        case 'erc20':
        case 'nftCollection':
        case 'address':
            return typeof value === 'string' && isAddress(value);
        case 'float':
        case 'fixed':
        case 'ufixed':
            return typeof value === 'number';
        case 'url':
            return typeof value === 'string' && isValidUrl(value);
        case 'phone_number':
            return typeof value === 'string' && isValidPhoneNumber(value);
        case 'string':
        case 'paragraph':
            return typeof value === 'string';
        case 'logic_operator':
            const validOperators = new Set(['gte', 'gt', 'lte', 'lt', 'eq', 'neq']);
            return typeof value === 'string' && validOperators.has(value);
        case 'any':
            return true;
        default:
            return false;
    }
}

function isIntInRange(value: number | bigint, bits: number): boolean {
    const min = BigInt(-(2 ** (bits - 1)));
    const max = BigInt((2 ** (bits - 1)) - 1);
    const bigIntValue = BigInt(value);
    return bigIntValue >= min && bigIntValue <= max;
}

function isUintInRange(value: number | bigint, bits: number): boolean {
    const max = BigInt((2 ** bits) - 1);
    const bigIntValue = BigInt(value);
    return bigIntValue >= 0 && bigIntValue <= max;
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
    return /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);
}