import { Currency } from "../../core/entities/Currency";
import { ICurrencyRepository } from "../../core/repository/ICurrencyRepository";


export class CurrencyMookRepository implements ICurrencyRepository {
    constructor(
        private readonly currencies: Currency[]
    ) {
    }

    GetAll(): Currency[] {
        return this.currencies;
    }

    GetByCode(currencyCode: string): Currency | undefined {
        return this.currencies.find(it => it.CurrencyCode.toLowerCase() === currencyCode.toLowerCase());
    }
}