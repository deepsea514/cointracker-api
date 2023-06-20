[Index](../index.md)

## Websocket for Trading View data

This document contains the specifications for the Websocket implementation for Trading View data.

## wss://api.casperdefi.com

Used to fetch the trading view data for a [Token](../models/token.md). It has a `history` field that contains an array of price [History](../models/trading-view.md)

- URL: `wss://api.casperdefi.com?token=<tokenAddress>&chainId=<chainId>&exchange=<exchange>`
- Handshake Path: `/websocket`
- Events:
  - `connected`: Triggered when a socket connects to the server
  - `error`: Triggered when there is an error
  - `history`: Triggered the first time a user connects, but also every 30 seconds from the time the server started.
- Body: `None`
- Headers: `None`
- Queries:
  - `chainId`: number
    - 1: ETH
    - 56: BSC
    - 250: FTM
  - `exchange`: string
    - `paint`: PaintSwap
    - `spirit`: SpiritSwap
    - `sushi`: SushiSwap
  - `token`: The address of token
- Access: `Public`
- Response: [Response](../models/token.md)
- Data: `{ tokens: object[] }`
- Examples:
  - `wss://api.casperdefi.com?token=0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345&chainId=250&exchange=paint`
