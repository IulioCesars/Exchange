import { CurrencyBalance } from "../../core/entities/CurrencyBalance";
import { ExchangeTransaction } from "../../core/entities/ExchangeTransaction";
import { ICurrencyBalanceRepository } from "../../core/repository/ICurrencyBalanceRepository";

export class CurrencyBalanceMookRepository implements ICurrencyBalanceRepository {
    private readonly transactions: ExchangeTransaction[];

    constructor(
        private readonly balances: CurrencyBalance[]
    ) {
        this.transactions = [];
    }


    GetBalances(): CurrencyBalance[] {
        const currentBalaces : CurrencyBalance[] = []

        for (const b of this.balances)
        {
            const balance = this.GetBalanceByIdCurrency(b.IdCurrency);
            if (balance)
                currentBalaces.push(balance)
        }

        return currentBalaces;
    }

    GetBalanceByIdCurrency(idCurrency: number): CurrencyBalance | undefined {
        const currentBalance = this.balances.find(it => it.IdCurrency === idCurrency);
        
        if(!currentBalance)
            return undefined;

        const creditTransactions = this.transactions.filter(it => it.IdCurrencyOriginal === idCurrency).map(it => it.Fee).reduce((s, c) => s + c, 0);
        const debitTransactions = this.transactions.filter(it => it.IdCurrencyTarget === idCurrency).map(it => it.AmountCurrencyBase).reduce((s, c) => s + c, 0);

        const totalAmountBalance = currentBalance.Balance + creditTransactions - debitTransactions;

        return { ... currentBalance, Balance: totalAmountBalance };
    }

    SaveExchangeTransaction(transaction: ExchangeTransaction): number {
        const idTransfer = this.transactions.length + 1;
        this.transactions.push({ ... transaction, IdTransfer: idTransfer });

        return idTransfer;
    }
}