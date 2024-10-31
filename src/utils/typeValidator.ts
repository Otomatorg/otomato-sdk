import { ethers } from 'ethers';

export function validateType(expectedType: string, value: any): boolean {
    if (typeof value === 'string' && isVariable(value)) {
        return true; // Allow all variable strings
    }

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
        case 'percentage':
            return typeof value === 'number' && value >= 0 && value <= 100;
        case 'url':
            return typeof value === 'string' && isValidUrl(value);
        case 'phone_number':
            return typeof value === 'string' && isValidPhoneNumber(value);
        case 'email':
            return typeof value === 'string' && isValidEmail(value);
        case 'string':
        case 'paragraph':
            return typeof value === 'string';
        case 'logic_operator':
            const validOperators = new Set(['gte', 'gt', 'lte', 'lt', 'eq', 'neq']);
            return typeof value === 'string' && validOperators.has(value);
        case 'addresses_array':
            // Ensure value is an array, and each element is a valid address
            return Array.isArray(value) && value.every(isAddress);
        case 'condition_groups':
            return Array.isArray(value) && value.every(isValidConditionGroup);
        case 'and_or':
            const validLogicOperators = new Set(['and', 'or']);
            return typeof value === 'string' && validLogicOperators.has(value.toLowerCase());
        case 'any':
            return true;
        default:
            return false;
    }
}

function isValidConditionGroup(value: any): boolean {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const { logic, checks } = value;

    validateType('and_or', logic)

    // Validate checks array
    if (!Array.isArray(checks) || checks.length === 0) {
        return false;
    }

    // Validate each condition check
    for (const check of checks) {
        if (!isValidConditionCheck(check)) {
            return false;
        }
    }

    return true;
}

function isValidConditionCheck(value: any): boolean {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const { value1, condition, value2 } = value;

    // Validate condition operator
    const validConditionOperators = new Set(['gte', 'gt', 'lte', 'lt', 'eq', 'neq']);
    if (typeof condition !== 'string' || !validConditionOperators.has(condition.toLowerCase())) {
        return false;
    }

    // Validate value1 and value2 (they can be numbers, strings, or variables)
    if (!isValidValue(value1) || !isValidValue(value2)) {
        return false;
    }

    return true;
}

function isValidValue(value: any): boolean {
    if (typeof value === 'number' || typeof value === 'bigint') {
        return true;
    }

    if (typeof value === 'string') {
        if (isVariable(value)) {
            return true; // It's a variable placeholder
        }
        // Optionally, add further validation for strings if needed
        return true;
    }

    return false;
}

function isVariable(value: string): boolean {
    return /\{\{nodeMap\.[^.}]+\.(?:output|parameters(?:\.abi\.parameters)?)\.[^.}]+\}\}/.test(value);
}

export function typeIsNumber(type: string): boolean {
    switch (type) {
        case 'integer':
        case 'float':
        case 'fixed':
        case 'ufixed':
        case 'chainId':
        case 'int8': case 'int16': case 'int32': case 'int64': case 'int128': case 'int256':
        case 'uint8': case 'uint16': case 'uint32': case 'uint64': case 'uint128': case 'uint256':
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

export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


/**
 * Checks if a string is numeric (represents a valid number).
 * @param value - The string to check.
 * @returns boolean - True if the string represents a number, false otherwise.
 */
export function isNumericString(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== '';
}