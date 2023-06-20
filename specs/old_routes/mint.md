## Mint route

This document contains the specifications for the /mints route.

## /mints

Used to fetch the latest mints by chain and exchange.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries:
  - `chainId`: number
    - 1: ETH (default)
    - 56: BSC
    - 250: FTM
  - `exchange`: number
    - `uni`: UniSwap (default)
    - `pancake`: PancakeSwap
    - `fantom`: FantomExchange
  - `limit`: number
    - default: 15
- Access: `Public`
- Response: [Response](../models/mint.md)
- Data: `{ mints: object[] }`
