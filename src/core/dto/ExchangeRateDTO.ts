export class ExchangeRateDTO {
    constructor(
        public OriginalCurrency: string,
        public TargetCurrency: string,
        public ExchangeRate: number,
        public Fee: number,
        public AmountAvailable: number
    ) {}
}