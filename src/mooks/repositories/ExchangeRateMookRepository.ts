import { ExchangeRate } from "../../core/entities/ExchangeRate";
import { IExchangeRateRepository } from "../../core/repository/IExchangeRateRepository";

export class ExchangeRateMookRepository implements IExchangeRateRepository {
    constructor(
        private readonly exchangeRates: ExchangeRate[]
    ) {}
    
    GetExchangeRateByIdCurrency(idCurrencyOriginal: number, idCurrencyTarget: number): ExchangeRate | undefined {
        return this.exchangeRates.find(it => it.IdCurrencyOriginal === idCurrencyOriginal && it.IdCurrencyTarget === idCurrencyTarget);
    }
}