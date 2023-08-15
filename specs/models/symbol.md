[Index](../index.md)

## Symbol model

This is a symbol model.

## What it looks like

```json
{
  "id": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // address as id?
  "name": "Wrapped Bitcoin_USD", // Fully qualified name?
  "description": "Wrapped BTC/WBTC",
  "currency_code": "USD",
  "exchange": "ETH_DEXGURU",
  "pricescale": 10, // TODO: not sure what this does
  "ticker": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth_USD", // address-token_currency
  "full_name": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // address?
  "listed_exchange": "dex.guru",
  "type": "crypto",
  "session": "24x7",
  "data_status": "pulsed",
  "has_daily": true,
  "has_weekly_and_monthly": true,
  "has_empty_bars": true,
  "force_session_rebuild": true,
  "has_no_volume": false,
  "volume_precision": 2,
  "timezone": "Etc/UTC",
  "format": "price",
  "minmov": 1,
  "has_intraday": true,
  "supported_resolutions": ["1", "5", "10", "30", "60", "240", "720", "1D", "1W"]
}
```
