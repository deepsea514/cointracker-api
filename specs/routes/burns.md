## Burns route

This document contains the specifications for the /burns route.

## /burns

Used to fetch the latest [Burns](../models/burn.md) by chain and exchange.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries:
  - chainId: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
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
- Data: `{ burns: object[] }`
- Examples:
  - `http://localhost:3000/api/v1/burns?limit=15&exchange=sushi&chainId=250`
  - `https://api.diablodex.io:3000/v1/burns?limit=15&exchange=sushi&chainId=250`
