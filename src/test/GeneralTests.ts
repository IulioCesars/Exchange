import { describe, it } from 'mocha'
import { expect, assert } from 'chai';
import { MockFactory } from '../mooks/factory/MockFactory';
import { ExchangeRateDTO } from '../core/dto/ExchangeRateDto';
import { ExchangeTransactionDTO } from '../core/dto/ExchangeTransactionDTO';
import { GenerateRandomNumber } from '../mooks/utils/Random';
import { resourceUsage } from 'process';
import { BusinessErrorDTO } from '../core/dto/BusinessErrorDTO';

const factory = new MockFactory();


function getServiceAndCatalogs() {
    const service = factory.buildService();    
    const balances = service.QueryExchangeBalances();
    const currencyPairs = balances
        .map(it => {
            const otherCurrencies = balances.filter(x => x !== it);

            return otherCurrencies.map(x => ({
                CurrencyCodeOriginal: it.CurrencyCode,
                CurrencyCodeTarget: x.CurrencyCode
            }));
        }).reduce((c, n) => c.concat(n), []);

    return { service, balances, currencyPairs };
}

describe("Query exchange rate", () => {
    const { service, balances, currencyPairs } = getServiceAndCatalogs();

    for(const cp of currencyPairs)
    {
        it(`Query Exchange Rate ${cp.CurrencyCodeOriginal} to ${cp.CurrencyCodeTarget}`, () => {
            const result = service.QueryExchangeRate(cp.CurrencyCodeOriginal, cp.CurrencyCodeTarget);

            if (result instanceof BusinessErrorDTO)
            {
                assert.throws(() => Error(`ExchangeResult is error ${result.Message}`));
                return;
            }

            expect(result, "Have OriginalCurrency Property").to.have.property("OriginalCurrency").which.is.a("string");
            expect(result, "Have TargetCurrency Property").to.have.property("TargetCurrency").which.is.a("string");
            expect(result, "Have ExchangeRate Property").to.have.property("ExchangeRate").which.is.a("number");
            expect(result, "Have Fee Property").to.have.property("Fee").which.is.a("number");
            expect(result, "Have AmountAvailable Property").to.have.property("AmountAvailable").which.is.a("number");
        });
    }
});

describe("Exchange currency", () => {
    const { service, balances, currencyPairs } = getServiceAndCatalogs();

    for(const cp of currencyPairs)
    {
        const amount = GenerateRandomNumber(10, 200);
        it(`Exchange currency ${cp.CurrencyCodeOriginal} to ${cp.CurrencyCodeTarget}, amount: ${amount}`, () => {

            const oldBalances = service.QueryExchangeBalances();
            const exchangeResult = service.ExchangeCurrency(cp.CurrencyCodeOriginal, cp.CurrencyCodeTarget, amount);
            const newBalances = service.QueryExchangeBalances();

            if (exchangeResult instanceof BusinessErrorDTO)
            {
                assert.throws(() => Error(`ExchangeResult is error ${exchangeResult.Message}`));
                return;
            }

            expect(exchangeResult, "Have IdTransfer Property").to.have.property("IdTransfer").which.is.a("number");
            expect(exchangeResult, "Have CurrencyCodeOriginal Property").to.have.property("CurrencyCodeOriginal").which.is.a("string");
            expect(exchangeResult, "Have CurrencyCodeTarget Property").to.have.property("CurrencyCodeTarget").which.is.a("string");
            expect(exchangeResult, "Have AmountCurrencyBase Property").to.have.property("AmountCurrencyBase").which.is.a("number");
            expect(exchangeResult, "Have AmountCurrencyTarget Property").to.have.property("AmountCurrencyTarget").which.is.a("number");
            expect(exchangeResult, "Have ExchangeRate Property").to.have.property("ExchangeRate").which.is.a("number");
            expect(exchangeResult, "Have Fee Property").to.have.property("Fee").which.is.a("number");

            const originalCurrencyOldBalance = oldBalances.find(it => it.CurrencyCode == cp.CurrencyCodeOriginal);
            const targetCurrencyOldBalance = oldBalances.find(it => it.CurrencyCode == cp.CurrencyCodeTarget);

            const originalCurrencyNewBalance = newBalances.find(it => it.CurrencyCode == cp.CurrencyCodeOriginal);
            const targetCurrencyNewBalance = newBalances.find(it => it.CurrencyCode == cp.CurrencyCodeTarget);

            expect((originalCurrencyOldBalance?.Balance ?? 0) + exchangeResult.Fee, "Add fee to original currency balance").to.eql(originalCurrencyNewBalance?.Balance);
            expect((targetCurrencyOldBalance?.Balance ?? 0) - exchangeResult.AmountCurrencyBase, "subtract amountbase to target currency balance").to.eql(targetCurrencyNewBalance?.Balance);
        });
    }
});