## Mints route

This document contains the specifications for the /mints route.

## /mints

Used to fetch the latest [Mints](../models/mint.md) by chain and exchange.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries:
  - chainId: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `limit`: number
    - default: 15
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ mints: Mint[] }`
- Examples:
  - `http://localhost:3000/api/v1/mints?limit=15&exchange=spirit&chainId=250`
  - `https://api.casperdefi.com/v1/mints?limit=15&exchange=spirit&chainId=250`
