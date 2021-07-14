export interface ExchangeTransaction {
    IdTransfer?: number,
    IdCurrencyOriginal: number,
    IdCurrencyTarget: number,
    AmountCurrencyBase: number,
    AmountCurrencyTarget: number,
    ExchangeRate: number,
    Fee: number,
    CreationDate: Date
}