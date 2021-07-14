import { Currency } from "../entities/Currency";
import { CurrencyBalance } from "../entities/CurrencyBalance";
import { ExchangeTransaction } from "../entities/ExchangeTransaction";

export interface ICurrencyBalanceRepository
{
    GetBalances(): CurrencyBalance[];
    GetBalanceByIdCurrency(idCurrency: number): CurrencyBalance | undefined;
    SaveExchangeTransaction(transaction: ExchangeTransaction): number;
}