import { ExchangeRate } from "../entities/ExchangeRate";

export interface IExchangeRateRepository {
    GetExchangeRateByIdCurrency(idCurrencyOriginal: number, idCurrencyTarget: number): ExchangeRate | undefined;
}