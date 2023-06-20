[Index](../index.md)

## Pricing route

This document contains the specifications for the /pricing route.

## /prices

Used to fetch the [Prices](../models/price.md) for a list of tokens.

- Method: `POST`
- Body: `{ tokens: string[] }`
- Headers: `None`
- Params: `None`
- Queries:
  - chainId: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ prices: Price[] }`
- Examples
  - `http://localhost:3000/api/v1/prices&chainId=250`
    - Body: `{ tokens: ["0x5cc61a78f164885776aa610fb0fe1257df78e59b", "0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345"]}`
    - - Examples
  - `https://api.casperdefi.com/v1/prices&chainId=250`
    - Body: `{ tokens: ["0x5cc61a78f164885776aa610fb0fe1257df78e59b", "0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345"]}`
