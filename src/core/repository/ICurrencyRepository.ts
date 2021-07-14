import { Currency } from "../entities/Currency";

export interface ICurrencyRepository {
    GetAll(): Currency[];
    GetByCode(currencyCode: string): Currency | undefined;
}