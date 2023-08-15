import { gql } from 'graphql-request'

export const TOKEN_HISTORICAL = gql`
  query GetSwaps($first: Int!, $skip: Int!, $pair: ID!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
    pair(id: $pair) {
      id
      reserve0
      reserve1
      reserveUSD
      token0Price
      token1Price
      token0 {
        address: id
        symbol
        decimals
      }
      token1 {
        address: id
        symbol
        decimals
      }
    }

    swaps(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { pair: $pair, timestamp_lte: $timestamp_lte, timestamp_gte: $timestamp_gte }
    ) {
      transaction {
        id
        blockNumber: block
        timestamp
      }
      id
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
      from
      sender
    }
  }
`
