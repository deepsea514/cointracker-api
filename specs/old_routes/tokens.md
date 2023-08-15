[Index](../index.md)

## Token route

This document contains the specifications for the /token route.

## /tokens

Used to fetch the tokens. Returns a list of available [Tokens](../models/token.md)

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries: `sortBy, order, fromNum, limit, field, value`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ tokens: object[] }`
- Examples:
  - `http://localhost:3000/api/v1/tokens/`
  - `https://localhost:3000/api/v1/tokens/?sortBy=volume24hUSD&order=desc&fromNum=0&limit=20&field=verified&value=true`

## /tokens/:id

Used to fetch the data for a [Token](../models/token.md) by id.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `id`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ token: object }`
- Examples:
  - `http://localhost:3000/api/v1/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth/`

## /tokens/:id/history

Used to fetch the historical data for a token. Will either accept timestamps or blocks to fetch the data. The `id` in the examples is a combination of `address` and `symbol`. Returns the [History](../models/history.md) for the [Token](../models/token.md)

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `id`
- Queries: `fromBlock, toBlock, fromTimestamp, toTimestamp, interval, currency`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ history: object[] }`
- Examples:
  - `http://localhost:3000/api/v1/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth/history?fromTimestamp=1616651042&toTimestamp=1624427042&interval=day&currency=USD`
  - `http://localhost:3000/api/v1/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth/history?fromBlock=10325626&toBlock=latest&interval=day&currency=USD`

## /tokens/:id/swaps

Used to get the 15 most recent [Swaps](../models/swap.md) on the exchange. `// TODO: since we aren't running an exchange yet, maybe we can source this data from other exchanges and allow the user to select it. Pass the exchange as a query to the API`

- Method: `GET`
- Body: `{ limit: number, order: string, sortBy: string }`
- Headers: `None`
- Params: `id`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ swaps: object[] }`
- Example
  - `http://localhost:3000/api/v1/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth/swaps`

## /tokens/:id/burns

Used to get the 15 most recent [Burns](../models/burn.md) on the exchange.

- Method: `GET`
- Body: `{ limit: number, order: string, sortBy: string }`
- Headers: `None`
- Params: `id`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ burns: object[] }`
- Example:
  - `https://localhost:3000/api/v1/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth/burns`
