## Swaps route

This document contains the specifications for the /swaps route.

## /swaps

Used to fetch the latest [Swaps](../models/swap.md) by chain and exchange.

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
- Access: `Private`
- Response: [Response](../models/response.md)
- Data: `{ swaps: Swap[] }`
- Examples:
  - `http://localhost:3000/api/v1/swaps?limit=15&exchange=paint&chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.casperdefi.com/v1/swaps?limit=15&exchange=paint&chainId=250&secret=<your_secret>&key=<your_key>`
