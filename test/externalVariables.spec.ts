import { expect } from 'chai';
import { TRIGGERS, CHAINS, getTokenFromSymbol } from '../src/index';
import { getExternalVariable, getExternalVariableFromParameters } from '../src/utils/externalVariables';

describe('external variables construction', () => {

    it('should create lending rate ionic USDT', () => {
        const variable = getExternalVariable(
            TRIGGERS.LENDING.IONIC.LENDING_RATE.prototype,
            [CHAINS.MODE, getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress]
        );

        expect(variable).to.equal('{{external.functions.ionicLendingRate(34443,0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });

    it('should create lending rate ionic USDT - with internal variables', () => {
        const variable = getExternalVariable(
            TRIGGERS.LENDING.IONIC.LENDING_RATE.prototype,
            ['{{nodeMap.1.parameters.chainId}}', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress]
        );

        expect(variable).to.equal('{{external.functions.ionicLendingRate({{nodeMap.1.parameters.chainId}},0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });

    it('should create borrowing rate ionic USDT', () => {
        const variable = getExternalVariable(
            TRIGGERS.LENDING.IONIC.BORROWING_RATES.prototype,
            ['{{nodeMap.1.parameters.chainId}}', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress]
        );

        expect(variable).to.equal('{{external.functions.ionicBorrowingRate({{nodeMap.1.parameters.chainId}},0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });

    it('should create sUSDE yield', () => {
        const variable = getExternalVariable(
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.prototype,
            []
        );

        expect(variable).to.equal('{{external.functions.sUSDEYield()}}');
    });

    
    it('should create price movement against currency', () => {
        const variable = getExternalVariable(
            TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY.prototype,
            [
                CHAINS.MODE,
                , // comparisonValue
                'USD', // currency
                , // condition
                getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress, // contractAddress
            ]
        );

        expect(variable).to.equal('{{external.functions.priceMovementAgainstCurrency(34443,,USD,,0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });



});

describe('external variables construction from object', () => {

    it('should create lending rate ionic USDT', () => {
        const variable = getExternalVariableFromParameters(
            TRIGGERS.LENDING.IONIC.LENDING_RATE.prototype,
            [{"key": "chainId", "value": 34443}, {"key": "token", "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"}],
        );

        expect(variable).to.equal('{{external.functions.ionicLendingRate(34443,0xf0F161fDA2712DB8b566946122a5af183995e2eD,,)}}');
    });

    it('should create sUSDE yield', () => {
        const variable = getExternalVariableFromParameters(
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.prototype,
            []
        );

        expect(variable).to.equal('{{external.functions.sUSDEYield(,)}}');
    });

    it('should create price movement against currency', () => {
        const variable = getExternalVariableFromParameters(
            TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY.prototype,
            [
                {key: 'chainId', value: CHAINS.MODE},
                {key: 'currency', value: 'USD'}, // currency
                {key: 'contractAddress', value: getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress},
            ]
        );

        expect(variable).to.equal('{{external.functions.priceMovementAgainstCurrency(34443,,USD,,0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });

    it('should create price movement against currency and automatically fill default values if not provided', () => {
        const variable = getExternalVariableFromParameters(
            TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY.prototype,
            [
                {key: 'chainId', value: CHAINS.MODE},
                {key: 'contractAddress', value: getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress},
            ]
        );

        expect(variable).to.equal('{{external.functions.priceMovementAgainstCurrency(34443,,USD,,0xf0F161fDA2712DB8b566946122a5af183995e2eD)}}');
    });

});