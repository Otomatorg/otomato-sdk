import { ethers } from 'ethers';
import { getToken, getTokenFromSymbol } from '../constants/tokens.js';
import { isAddress, isNumericString } from './typeValidator.js';
import { CHAINS } from '../constants/chains.js';

export async function convertToTokenUnits(amount: number, chainId: number, contractAddress: string): Promise<ethers.BigNumberish> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Max BigInt - For Withdraw All from protocols
    if (amount.toString() === "115792089237316195423570985008687907853269984665640564039457584007913129639935n") {
      return amount;
    }
    
    // Calculate the result as a number first
    const result = amount * Math.pow(10, decimals);
    
    // Check if the result is an integer
    if (!Number.isInteger(result)) {
        throw new Error(`Conversion resulted in a non-integer value: ${result}. Please provide an amount that results in a whole number of token units.`);
    }
    
    // If we've reached here, the result is an integer, so we can safely convert to BigInt
    return BigInt(Math.round(result));
}

export async function convertToTokenUnitsFromSymbol(amount: number, chainId: number, symbol: string): Promise<ethers.BigNumberish> {
    const token = await getTokenFromSymbol(chainId, symbol);
    const decimals = token.decimals;
    const adjustedAmount = ethers.parseUnits(amount.toString(), decimals);
    return adjustedAmount;
}

export async function convertToTokenUnitsFromDecimals(amount: number, decimals: number): Promise<ethers.BigNumberish> {
    const adjustedAmount = ethers.parseUnits(amount.toString(), decimals);
    return adjustedAmount;
}

export async function convertTokenUnitsFromSymbol(amount: bigint, chainId: number, symbol: string): Promise<number> {
    const token = await getTokenFromSymbol(chainId, symbol);
    const decimals = token.decimals;

    // Convert to float using division
    return Number(amount) / Math.pow(10, decimals);
}

export async function convertTokenUnitsFromAddress(amount: bigint, chainId: number, contractAddress: string): Promise<number> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Convert to float using division
    return Number(amount) / Math.pow(10, decimals);
}

export async function convertTokenUnitsFromDecimals(amount: bigint, decimals: number): Promise<number> {
    // Convert to float using division
    return Number(amount) / Math.pow(10, decimals);
}

/**
 * Compares two Ethereum addresses after normalizing them to lowercase.
 * @param address1 - The first Ethereum address to compare.
 * @param address2 - The second Ethereum address to compare.
 * @returns boolean - True if the addresses are equal, false otherwise.
 */
export function compareAddresses(address1: string, address2: string): boolean {
    // Normalize the addresses by converting them to lowercase
    const normalizedAddress1 = address1.toLowerCase();
    const normalizedAddress2 = address2.toLowerCase();

    // Compare the normalized addresses
    return normalizedAddress1 === normalizedAddress2;
}

/**
 * Generates a formula string for dynamically computing the ERC20 amount in the workflow,
 * based on the amount, chain ID, and contract address.
 * If the contract address is valid, it will be wrapped in double quotes.
 * If the amount is a numeric string, it will also be wrapped in double quotes.
 * @param amount - The amount of the ERC20 token to compute.
 * @param chainId - The ID of the blockchain network.
 * @param contractAddress - The contract address of the ERC20 token.
 * @returns string - A formatted string to be used as a variable in the workflow.
 */
export function getComputeERC20Variable(amount: string, chainId: any, contractAddress: string): string {
    // Check if the contract address is a valid Ethereum address and wrap in quotes if it is
    const formattedContractAddress = isAddress(contractAddress) ? `"${contractAddress}"` : contractAddress;

    // Check if the amount is a numeric string and wrap it in quotes if it is
    const formattedAmount = isNumericString(amount) ? `${amount}` : amount;

    // Construct the computeERC20Amount formula
    return `{{computeERC20Amount(${formattedAmount}, ${chainId}, '${formattedContractAddress}')}}`;
}

export function getProtocolTokenForBlock(chain: number, triggerBlockId: number, asset: string): string {
    const aaveBlockIds = [100021];
    const ionicBlockIds = [100007];
    const moonwellBlockIds = [100023];
    const compoundBlockIds = [100028];

    if (aaveBlockIds.includes(triggerBlockId)) {
        if (chain == CHAINS.BASE) {
            switch (asset.toLowerCase()) {
                case getTokenFromSymbol(CHAINS.BASE, 'WETH').contractAddress.toLowerCase():
                    return '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7';  // aBasWETH
                case getTokenFromSymbol(CHAINS.BASE, 'WeETH').contractAddress.toLowerCase():
                    return '0x7C307e128efA31F540F2E2d976C995E0B65F51F6';  // aBasweETH
                case getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress.toLowerCase():
                    return '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB';  // aBasUSDC
                case getTokenFromSymbol(CHAINS.BASE, 'cbBTC').contractAddress.toLowerCase():
                    return '0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6';  // aBascbBTC
                case getTokenFromSymbol(CHAINS.BASE, 'wstETH').contractAddress.toLowerCase():
                    return '0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D';  // aBaswstETH
                case getTokenFromSymbol(CHAINS.BASE, 'cbETH').contractAddress.toLowerCase():
                    return '0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad';  // aBascbETH
                case getTokenFromSymbol(CHAINS.BASE, 'USDbc').contractAddress.toLowerCase():
                    return '0x0a1d576f3eFeF75b330424287a95A366e8281D54';  // aBasUSDbC
            
                default: throw new Error('This asset is not available on Aave');
            }
        }
    }

    if (ionicBlockIds.includes(triggerBlockId)) {
        if (chain == CHAINS.MODE) {
            switch (asset.toLowerCase()) {
                case getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress.toLowerCase():
                    return '0x94812F2eEa03A49869f95e1b5868C6f3206ee3D3';
                case getTokenFromSymbol(CHAINS.MODE, 'USDC').contractAddress.toLowerCase():
                    return '0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038';
                case getTokenFromSymbol(CHAINS.MODE, 'ezETH').contractAddress.toLowerCase():
                    return '0x59e710215d45F584f44c0FEe83DA6d43D762D857';
                case getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress.toLowerCase():
                    return '0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2';
                case getTokenFromSymbol(CHAINS.MODE, 'WBTC').contractAddress.toLowerCase():
                    return '0xd70254C3baD29504789714A7c69d60Ec1127375C';
                case getTokenFromSymbol(CHAINS.MODE, 'STONE').contractAddress.toLowerCase():
                    return '0x959FA710CCBb22c7Ce1e59Da82A247e686629310';
                case getTokenFromSymbol(CHAINS.MODE, 'wrsETH').contractAddress.toLowerCase():
                    return '0x49950319aBE7CE5c3A6C90698381b45989C99b46';
                case getTokenFromSymbol(CHAINS.MODE, 'weETH.mode').contractAddress.toLowerCase():
                    return '0xA0D844742B4abbbc43d8931a6Edb00C56325aA18';
                case getTokenFromSymbol(CHAINS.MODE, 'M-BTC').contractAddress.toLowerCase():
                    return '0x19F245782b1258cf3e11Eda25784A378cC18c108';

                default: throw new Error('This asset is not available on Ionic');
            }
        }

        if (chain == CHAINS.BASE) {
            switch (asset.toLowerCase()) {
                case getTokenFromSymbol(CHAINS.BASE, 'ezETH').contractAddress.toLowerCase():
                    return '0x079f84161642D81aaFb67966123C9949F9284bf5';  // ionezETH
                case getTokenFromSymbol(CHAINS.BASE, 'wstETH').contractAddress.toLowerCase():
                    return '0x9D62e30c6cB7964C99314DCf5F847e36Fcb29ca9';  // ionwstETH
                case getTokenFromSymbol(CHAINS.BASE, 'cbETH').contractAddress.toLowerCase():
                    return '0x9c201024A62466F9157b2dAaDda9326207ADDd29';  // ioncbETH
                case getTokenFromSymbol(CHAINS.BASE, 'AERO').contractAddress.toLowerCase():
                    return '0x014e08F05ac11BB532BE62774A4C548368f59779';  // ionAERO
                case getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress.toLowerCase():
                    return '0xa900A17a49Bc4D442bA7F72c39FA2108865671f0';  // ionUSDC
                case getTokenFromSymbol(CHAINS.BASE, 'WETH').contractAddress.toLowerCase():
                    return '0x49420311B518f3d0c94e897592014de53831cfA3';  // ionWETH
                case getTokenFromSymbol(CHAINS.BASE, 'weETH').contractAddress.toLowerCase():
                    return '0x84341B650598002d427570298564d6701733c805';  // ionweETH
                case getTokenFromSymbol(CHAINS.BASE, 'eUSD').contractAddress.toLowerCase():
                    return '0x9c2A4f9c5471fd36bE3BBd8437A33935107215A1';  // ioneUSD
                case getTokenFromSymbol(CHAINS.BASE, 'bsdETH').contractAddress.toLowerCase():
                    return '0x3D9669DE9E3E98DB41A1CbF6dC23446109945E3C';  // ionbsdETH
                case getTokenFromSymbol(CHAINS.BASE, 'hyUSD').contractAddress.toLowerCase():
                    return '0x751911bDa88eFcF412326ABE649B7A3b28c4dEDe';  // ionhyUSD
                case getTokenFromSymbol(CHAINS.BASE, 'RSR').contractAddress.toLowerCase():
                    return '0xfc6b82668E10AFF62f208C492fc95ef1fa9C0426' // ionRSR;
                case getTokenFromSymbol(CHAINS.BASE, 'wsuperOETHb').contractAddress.toLowerCase():
                    return '0xC462eb5587062e2f2391990b8609D2428d8Cf598';  // ionwsuperOETHb
                case getTokenFromSymbol(CHAINS.BASE, 'wUSDM').contractAddress.toLowerCase():
                    return '0xe30965Acd0Ee1CE2e0Cd0AcBFB3596bD6fC78A51';  // ionwUSDM
                case getTokenFromSymbol(CHAINS.BASE, 'cbBTC').contractAddress.toLowerCase():
                    return '0x1De166df671AE6DB4C4C98903df88E8007593748';  // ioncbBTC
                case getTokenFromSymbol(CHAINS.BASE, 'EURC').contractAddress.toLowerCase():
                    return '0x0E5A87047F871050c0D713321Deb0F008a41C495';  // ionEURC
                case getTokenFromSymbol(CHAINS.BASE, 'OGN').contractAddress.toLowerCase():
                    return '0xE00B2B2ca7ac347bc7Ca82fE5CfF0f76222FF375' // ionOGN;
                case getTokenFromSymbol(CHAINS.BASE, 'USD+').contractAddress.toLowerCase():
                    return '0x74109171033F662D5b898A7a2FcAB2f1EF80c201' // ionUSD;
                case getTokenFromSymbol(CHAINS.BASE, 'USDz').contractAddress.toLowerCase():
                    return '0xa4442b665d4c6DBC6ea43137B336e3089f05626C';  // ionUSDz
                case getTokenFromSymbol(CHAINS.BASE, 'wUSD+').contractAddress.toLowerCase():
                    return '0xF1bbECD6aCF648540eb79588Df692c6b2F0fbc09';  // ionwUSD
                case getTokenFromSymbol(CHAINS.BASE, 'sUSDz').contractAddress.toLowerCase():
                    return '0xf64bfd19DdCB2Bb54e6f976a233d0A9400ed84eA';  // ionsUSDz
                case getTokenFromSymbol(CHAINS.BASE, 'uSOL').contractAddress.toLowerCase():
                    return '0xbd06905590b6E1b6Ac979Fc477A0AebB58d52371';  // ionuSOL
                case getTokenFromSymbol(CHAINS.BASE, 'uSUI').contractAddress.toLowerCase():
                    return '0xAa255Cf8e294BD7fcAB21897C0791e50C99BAc69';  // ionuSUI  

                default: throw new Error('This asset is not available on Ionic');
            }
        }
    }

    if (moonwellBlockIds.includes(triggerBlockId)) {
        if (chain == CHAINS.BASE) {
            switch (asset.toLowerCase()) {
                case getTokenFromSymbol(CHAINS.BASE, 'DAI').contractAddress.toLowerCase():
                    return '0x73b06D8d18De422E269645eaCe15400DE7462417'; // Moonwell DAI
                case getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress.toLowerCase():
                    return '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22'; // Moonwell USDC
                case getTokenFromSymbol(CHAINS.BASE, 'WETH').contractAddress.toLowerCase():
                    return '0x628ff693426583D9a7FB391E54366292F509D457'; // Moonwell WETH
                case getTokenFromSymbol(CHAINS.BASE, 'cbETH').contractAddress.toLowerCase():
                    return '0x3bf93770f2d4a794c3d9EBEfBAeBAE2a8f09A5E5'; // Moonwell cbETH
                case getTokenFromSymbol(CHAINS.BASE, 'wstETH').contractAddress.toLowerCase():
                    return '0x627Fe393Bc6EdDA28e99AE648fD6fF362514304b'; // Moonwell wstETH
                case getTokenFromSymbol(CHAINS.BASE, 'rETH').contractAddress.toLowerCase():
                    return '0xcb1dacd30638ae38f2b94ea64f066045b7d45f44'; // Moonwell rETH
                case getTokenFromSymbol(CHAINS.BASE, 'weETH').contractAddress.toLowerCase():
                    return '0xb8051464C8c92209C92F3a4CD9C73746C4c3CFb3'; // Moonwell weETH
                case getTokenFromSymbol(CHAINS.BASE, 'AERO').contractAddress.toLowerCase():
                    return '0x73902f619CEB9B31FD8EFecf435CbDf89E369Ba6'; // Moonwell AERO
                case getTokenFromSymbol(CHAINS.BASE, 'cbBTC').contractAddress.toLowerCase():
                    return '0xF877ACaFA28c19b96727966690b2f44d35aD5976'; // Moonwell cbBTC
                case getTokenFromSymbol(CHAINS.BASE, 'EURC').contractAddress.toLowerCase():
                    return '0xb682c840B5F4FC58B20769E691A6fa1305A501a2'; // Moonwell EURC
                case getTokenFromSymbol(CHAINS.BASE, 'wrsETH').contractAddress.toLowerCase():
                    return '0xfC41B49d064Ac646015b459C522820DB9472F4B5'; // Moonwell wrsETH
                default:
                    throw new Error('This asset is not available on Moonwell');
            }
        }
    }

    if (compoundBlockIds.includes(triggerBlockId)) {
        if (chain == CHAINS.BASE) {
            switch (asset.toLowerCase()) {
                case getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress.toLowerCase():
                    return '0xb125E6687d4313864e53df431d5425969c15Eb2F';  // cUSDC
                case getTokenFromSymbol(CHAINS.BASE, 'WETH').contractAddress.toLowerCase():
                    return '0x46e6b214b524310239732D51387075E0e70970bf';  // cWETH
                case getTokenFromSymbol(CHAINS.BASE, 'AERO').contractAddress.toLowerCase():
                    return '0x784efeB622244d2348d4F2522f8860B96fbEcE89';  // cAERO
                case getTokenFromSymbol(CHAINS.BASE, 'USDbC').contractAddress.toLowerCase():
                    return '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf';  // cUSDbc
                default: 
                    throw new Error('This asset is not available on Compound');
            }
        }
    }

    throw new Error('Block is not supported');
}