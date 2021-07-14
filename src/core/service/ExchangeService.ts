import { BusinessErrorDTO } from "../dto/BusinessErrorDTO";
import { CurrencyBalanceDTO } from "../dto/CurrencyBalanceDTO";
import { ExchangeRateDTO } from "../dto/ExchangeRateDTO";
import { ExchangeTransactionDTO } from "../dto/ExchangeTransactionDTO";
import { ExchangeRate } from "../entities/ExchangeRate";
import { ExchangeTransaction } from "../entities/ExchangeTransaction";
import { ICurrencyBalanceRepository } from "../repository/ICurrencyBalanceRepository";
import { ICurrencyRepository } from "../repository/ICurrencyRepository";
import { IExchangeRateRepository } from "../repository/IExchangeRateRepository";

export class ExchangeService
{
    constructor(
        private currencyRepository: ICurrencyRepository,
        private exchangeRateRepository: IExchangeRateRepository,
        private currencyBalanceRepository: ICurrencyBalanceRepository
    ) {
    }

    private getExchangeRateByCurrencyPair(originalCurrencyCode: string, targetCurrencyCode: string) : ExchangeRate | BusinessErrorDTO
    {
        const originalCurrency = this.currencyRepository.GetByCode(originalCurrencyCode);
        const targetCurrency = this.currencyRepository.GetByCode(targetCurrencyCode);

        if(!originalCurrency)
            return new BusinessErrorDTO(`The currency code ${originalCurrencyCode} not exists`);
        if (!targetCurrency)
            return new BusinessErrorDTO(`The currency code ${targetCurrencyCode} not exists`);

        const exRate = this.exchangeRateRepository.GetExchangeRateByIdCurrency(originalCurrency.IdCurrency, targetCurrency.IdCurrency);
        if (!exRate)
            return new BusinessErrorDTO(`There is no exchange rate pair with the currencies '${originalCurrencyCode}' and '${targetCurrencyCode}'`);

        return exRate;
    }

    QueryExchangeRate(originalCurrencyCode: string, targetCurrencyCode: string) : ExchangeRateDTO | BusinessErrorDTO {
        const exRate = this.getExchangeRateByCurrencyPair(originalCurrencyCode, targetCurrencyCode);

        if (exRate instanceof BusinessErrorDTO)
            return exRate;

        const targetCurrencyBalance = this.currencyBalanceRepository.GetBalanceByIdCurrency(exRate.IdCurrencyTarget);
        return new ExchangeRateDTO(originalCurrencyCode, targetCurrencyCode, exRate.ExchangeRate, exRate.Fee, targetCurrencyBalance?.Balance ?? 0);
    }

    ExchangeCurrency(originalCurrencyCode: string, targetCurrencyCode: string, amountCurrencyBase: number) : ExchangeTransactionDTO | BusinessErrorDTO {
        const exRate = this.getExchangeRateByCurrencyPair(originalCurrencyCode, targetCurrencyCode);

        if (exRate instanceof BusinessErrorDTO)
            return exRate;

        const targetCurrencyBalance = this.currencyBalanceRepository.GetBalanceByIdCurrency(exRate.IdCurrencyTarget);
        const amountCurrencyTarget = exRate.ExchangeRate * amountCurrencyBase;        
        

        if(!targetCurrencyBalance || targetCurrencyBalance.Balance < amountCurrencyBase)
            return new BusinessErrorDTO(`There is not enough balance in the currency '${targetCurrencyCode}' to carry out the transaction`);

        const exchangeTransaction: ExchangeTransaction = 
        {
            IdCurrencyOriginal: exRate.IdCurrencyOriginal,
            IdCurrencyTarget: exRate.IdCurrencyTarget,
            AmountCurrencyBase: amountCurrencyBase,
            AmountCurrencyTarget: amountCurrencyTarget,
            ExchangeRate: exRate.ExchangeRate,
            Fee: exRate.Fee,
            CreationDate: new Date(Date.now())
        };

        const idTransfer = this.currencyBalanceRepository.SaveExchangeTransaction(exchangeTransaction);

        return {
            IdTransfer: idTransfer,
            CurrencyCodeOriginal: originalCurrencyCode,
            CurrencyCodeTarget: targetCurrencyCode,
            AmountCurrencyBase: exchangeTransaction.AmountCurrencyBase,
            AmountCurrencyTarget: exchangeTransaction.AmountCurrencyTarget,
            ExchangeRate: exchangeTransaction.ExchangeRate,
            Fee: exchangeTransaction.Fee,
        };
    }

    QueryExchangeBalances() : CurrencyBalanceDTO[] {
        const balances = this.currencyBalanceRepository.GetBalances();
        const currencies = this.currencyRepository.GetAll();

        return balances
            .filter(it => currencies.some(x => x.IdCurrency === it.IdCurrency))
            .map(it => ({
                Balance: it.Balance,
                CurrencyCode: currencies.find(x => x.IdCurrency === it.IdCurrency)?.CurrencyCode ?? ""
             }));
    }
}