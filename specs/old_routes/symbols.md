[Index](../index.md)

## Symbols route

This document contains the specifications for the /symbols route.

## /symbols

Used to fetch the symbols. Returns a list of [Symbols](../models/symbol.md)

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries: `symbol`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ symbols: object[] }`
- Examples:
  - `http://localhost:3000/api/v1/symbols/`
  - `http://localhost:3000/api/v1/symbols?symbol=0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth`
