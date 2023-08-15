[Index](../index.md)

## Token route

This document contains the specifications for the /tokens route.

## /tokens

Used to fetch the most traded tokens per exchange. Returns a list of [Token](../models/token.md)

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ tokens: Token[] }`
- Examples:
  - `http://localhost:3000/api/v1/tokens?exchange=spirit&chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens?exchange=spirit&chainId=250&secret=<your_secret>&key=<your_key>`

## /tokens/:token

Used to get the [Token](../models/token.md) details. This includes price, 24 hour volume/liquidity change and more.
If no exchange is specified, it will use the exchange with the highest liquidity.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `token`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ token: Token }`
- Example:
  - `http://localhost:3000/api/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345?chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345?chainId=250&secret=<your_secret>&key=<your_key>`

## /tokens/:token/trading-view

Used to fetch the historical trading view data for a token. Will accept timestamps (`new Date().getTime()`) to fetch the data.
Returns the [Token](../models/token.md) with embedded [History](../models/history.md)
If no exchange is specified, it will use the exchange with the highest liquidity for this token.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `token`
- Queries:
  - from: number
  - to: number
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `token: Token`
- Examples:
  - `http://localhost:3000/api/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/trading-view?from=1616651042018&to=1624427042018&chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/trading-view?from=1616651042018&to=1624427042018&chainId=250&secret=<your_secret>&key=<your_key>`

## /tokens/:token/swaps

Used to get the most recent [Swaps](../models/swap.md) on the exchange for a token.
If no exchange is specified, it will use the exchange with the highest liquidity for this token.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `token`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ swaps: Swap[] }`
- Example:
  - `http://localhost:3000/api/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/swaps?chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/swaps?chainId=250&secret=<your_secret>&key=<your_key>`

## /tokens/:token/mints

Used to get the most recent [Mints](../models/mint.md) on the exchange.
If no exchange is specified, it will use the exchange with the highest liquidity for this token.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `token`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ mints: Mint[] }`
- Example:
  - `http://localhost:3000/api/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/mints?chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/mints?chainId=250&secret=<your_secret>&key=<your_key>`

## /tokens/:token/burns

Used to get the most recent [Burn](../models/burn.md) on the exchange.
If no exchange is specified, it will use the exchange with the highest liquidity.

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `token`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
    - 369: PLS
    - 5000: NATIVE
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `secret`: string
  - `key`: string
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ burns: Burn[] }`
- Example:
  - `http://localhost:3000/api/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/burns?chainId=250&secret=<your_secret>&key=<your_key>`
  - `https://api.diablodex.io:3000/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345/burns?chainId=250&secret=<your_secret>&key=<your_key>`
