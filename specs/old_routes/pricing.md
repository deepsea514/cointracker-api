[Index](../index.md)

## Pricing route

This document contains the specifications for the /pricing route.

## /pricing

Used to fetch the pricing.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries: `address[], chainId=250, dex=spookyswap`
- Access: `Public`
- Response: [Response](../models/price.md)
- Data: `{ prices: object[] }`

## /pricing/historical?from=&to=

Used to fetch the historical pricing. Expects a from block number and to block number (or latest for the latest block). TODO: Modify to accept other relevant details as query as we proceed.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries: `address, from, to, chainId=250, dex=spookyswap`
- Access: `Public`
- Response: [Response](../models/price.md)
- Data: `{ prices: object[] }`
