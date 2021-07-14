export interface ExchangeTransactionDTO {
    IdTransfer?: number,
    CurrencyCodeOriginal: string,
    CurrencyCodeTarget: string,
    AmountCurrencyBase: number,
    AmountCurrencyTarget: number,
    ExchangeRate: number,
    Fee: number
}