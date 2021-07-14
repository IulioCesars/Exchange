import { Currency } from "../../core/entities/Currency";
import { CurrencyBalance } from "../../core/entities/CurrencyBalance";
import { ExchangeRate } from "../../core/entities/ExchangeRate";
import { ExchangeService } from "../../core/service/ExchangeService";
import { CurrencyBalanceMookRepository } from "../repositories/CurrencyBalanceMookRepository";
import { CurrencyMookRepository } from "../repositories/CurrencyMookRepository";
import { ExchangeRateMookRepository } from "../repositories/ExchangeRateMookRepository";
import { GenerateRandomNumber } from "../utils/Random";

export class MockFactory {

    private buildRepositories(): [CurrencyMookRepository, ExchangeRateMookRepository, CurrencyBalanceMookRepository] {
        const currencies: Currency[] = [
            { IdCurrency: 1, CurrencyCode: 'EUR', CurrencyName: 'Euro' },
            { IdCurrency: 2, CurrencyCode: 'USD', CurrencyName: 'US Dollar' },
            { IdCurrency: 3, CurrencyCode: 'JPY', CurrencyName: 'Japanese Yen' },
            { IdCurrency: 4, CurrencyCode: 'GBP', CurrencyName: 'British Pound' },
            { IdCurrency: 5, CurrencyCode: 'CHF', CurrencyName: 'Swiss Franc' },
            { IdCurrency: 6, CurrencyCode: 'AUD', CurrencyName: 'Australian Dollar' },
            { IdCurrency: 7, CurrencyCode: 'CAD', CurrencyName: 'Canadian Dollar' },
            { IdCurrency: 8, CurrencyCode: 'NZD', CurrencyName: 'New Zealand Dollar' }
        ];
        const balances : CurrencyBalance[] = [];
        const exchangeRates: ExchangeRate[] = [];

        for(const c of currencies)
        {
            balances.push({ IdCurrencyBalance: balances.length + 1, IdCurrency: c.IdCurrency, Balance: 1000 });
            const othersCurrencies = currencies.filter(it => it.IdCurrency != c.IdCurrency);

            for(const oc of othersCurrencies)
            {
                const exchangeRate = GenerateRandomNumber(20, 500);
                const fee = GenerateRandomNumber(1, 10);
                
                exchangeRates.push({
                    IdExchangeRate: exchangeRates.length + 1,
                    IdCurrencyOriginal: c.IdCurrency,
                    IdCurrencyTarget: oc.IdCurrency,
                    ExchangeRate: exchangeRate,
                    Fee: fee
                });
            }
        }

        var currencyRepo = new CurrencyMookRepository(currencies);
        var currencyBalanceRepo = new CurrencyBalanceMookRepository(balances);
        var exchangeRateRepo = new ExchangeRateMookRepository(exchangeRates);
        
        return [ currencyRepo, exchangeRateRepo, currencyBalanceRepo ];
    }

    public buildService() : ExchangeService {
        const [currencyRepo, exrateRepo, currencyBalanceRepo ] = this.buildRepositories();
        return new ExchangeService(currencyRepo, exrateRepo, currencyBalanceRepo);
    }
}