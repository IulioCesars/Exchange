# Simple Exchange App

Heroku URL: https://exchange-exaple.herokuapp.com/

## Operations in API
- Restart application and exchange rates
    - URL: {baseURL}/Restart
    - Description: Restart application and reinitialize exchange rates
    - Examples:
        - Request:
        ```
            Empty
        ```
        - Response
        ```
            Restart exchange rates success!
        ```

- Query an exchange rate
    - URL: {baseURL}/QueryExchangeRate
    - Description: Query exchange rate details, fee and available amount
    - Examples:
        - Request:
        ```
        {
            "OriginalCurrencyCode": "EUR",	
            "TargetCurrencyCode": "JPY"	
        }
        ```
        - Response
        ```
        {
            "OriginalCurrency": "EUR",
            "TargetCurrency": "JPY",
            "ExchangeRate": 302,
            "Fee": 30.200000000000003,
            "AmountAvailable": 40
        }
        ```

- Exchange a currency
    - URL: {baseURL}/ExchangeCurrency
    - Description: Exchange currency 
    - Examples:
        - Request:
        ```
        {
            "OriginalCurrencyCode": "EUR",	
            "TargetCurrencyCode": "JPY",
            "Amount": 50
        }
        ```
        - Response
        ```
        {
            "IdTransfer": 1,
            "CurrencyCodeOriginal": "EUR",
            "CurrencyCodeTarget": "JPY",
            "AmountCurrencyBase": 50,
            "AmountCurrencyTarget": 4150,
            "ExchangeRate": 83,
            "Fee": 8.3
        }
        ```
- Query exchange balances
    - URL: {baseURL}/QueryExchangeBalances
    - Description: Query exchange balances for all currencies
    - Examples:
        - Request:
        ```
            Empty
        ```
        - Response
        ```
        [
            {
                "Balance": 1008.3,
                "CurrencyCode": "EUR"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "USD"
            },
            {
                "Balance": 950,
                "CurrencyCode": "JPY"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "GBP"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "CHF"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "AUD"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "CAD"
            },
            {
                "Balance": 1000,
                "CurrencyCode": "NZD"
            }
        ]
        ```
