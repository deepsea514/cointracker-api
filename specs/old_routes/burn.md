[Index](../index.md)

## Burn route

This document contains the specifications for the /burns route.

## /burns

Used to fetch the available chains.

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
- Response: [Response](../models/burn.md)
- Data: `{ burn: object[] }`
