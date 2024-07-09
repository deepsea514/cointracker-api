## Specs

## Coin Tracker API

- Every exchange has a factory address/contract
- Every time a swap occurs a 'transfer' even gets fired off that we can listen too
- Current liquidity for a each pair can be pulled onchain
- Running a Fantom Node: https://github.com/doublesharp/fantom-docker
- uniswap-like pair docs: https://uniswap.org/docs/v2/smart-contracts/pair/
- uniswap-like factory docs: https://uniswap.org/docs/v2/smart-contracts/factory/
- ethers.js getLogs: https://docs.ethers.io/v5/api/providers/provider/#Provider-getLogs
- Working ethers.js events/filters example https://github.com/ethers-io/ethers.js/issues/463#issuecomment-475139501
- Web3 - https://web3js.readthedocs.io/en/v1.2.11/getting-started.html
- Web3 Eth Contract - https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html

## Endpoints

- /swaps (historic swaps)
- /liquidity (historic liquidity pool)
- /prices (trading view data)

## On page:

- liquidity history on left
- chart in center
- swap history on right

On page load for a new token, we should check if its already initialized (backfilled data in our database)

- if it is initialized (someone has already loaded it once)
  - we should return swap history up to current block (full history not needed, last 30 swaps maybe?)
    - this includes from_token, to_token, price_in_usd, timestamp?, block_number, user_address
  - we should return liquidity history (again, most recent 30?)
    - this includes token0, token1, price_in_usd, timestamp?, block_number, reserves, user_address
- if its not initialized
  - we should load the most recent 30 swaps/liquidity history as above
    - start to backfill database with historic data/pricing
- I think trading view data can be determined using swap history (single blocks like poocoin or grouped into 1m, 5m, etc)

## Goals

A list of goals for the API.

```typescript
// Goal: users will paste contract address and choose the chain, it will present live data about that token.

// TODO: Users can fetch historical pricing for tokens within a specified chain
// TODO: Add Solana Support
// TODO: Users can fetch a list of available chains -> URL/chains
// TODO: Users can fetch a list of tokens within a chain -> URL/tokens?chain=ethereum
// @droidomon I don't think this one is really achievable onchain, since there are so many tokens
// and we theoretically support them all. maybe we just want to have a list of top XXX tokens
// and either update that list when needed, or find a way to pull top tokens from the exchanges
// (I'm not sure how best to do that at the moment though...)

// TODO: Users can fetch historical pricing for a specific token within a specific chain -> URL/pricing?chain=ethereum&token=eth

// TODO: Users can see live external exchange data based on the specified chain: URL/exchanges?token=eth&limit=20

// TODO: Users can see live swapping data from local casper-swap (to be done later)
```
