import { GraphQLClient, gql } from 'graphql-request'
import { DayDataFragment, PairFragment, TokenFragment } from '../../fragments/sushiswap'

export const SUSHI_SWAP_ETH_CONFIG = {
  URL: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  CLIENT: new GraphQLClient('https://api.thegraph.com/subgraphs/name/sushiswap/exchange'),
  QUERIES: {
    PAIRS: gql`
      query Pair($token: String!) {
        pair0: pairs(where: { token0: $token }) {
          ...pairFields
        }

        pair1: pairs(where: { token1: $token }) {
          ...pairFields
        }
      }
      ${PairFragment}
    `,
    TOKENS: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }

        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          ...tokenFields

          dayData: dayData(orderBy: date, orderDirection: desc, first: 2) {
            ...dayDataFields
          }

          sevenDayData: dayData(orderBy: date, orderDirection: desc, first: 7) {
            ...dayDataFields
          }
        }
      }
      ${DayDataFragment}
      ${TokenFragment}
    `,
    TOKENS_WITH_7_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }

        tokens(orderBy: txCount, orderDirection: desc, first: $first) {
          ...tokenFields

          sevenDayData: dayData(orderBy: date, orderDirection: desc) {
            ...dayDataFields
          }
        }
      }
      ${DayDataFragment}
      ${TokenFragment}
    `,
    TOKEN_7_DAY_DATA: gql`
      query Token($address: String!) {
        sevenDayData: dayData(orderBy: date, orderDirection: desc, first: 7) {
          ...dayDataFields
        }
      }
      ${DayDataFragment}
    `,
    TOKEN_2_DAY_DATA: gql`
      query Token($address: String!) {
        dayData: dayData(orderBy: date, orderDirection: desc, first: 2) {
          ...dayDataFields
        }
      }
      ${DayDataFragment}
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }

        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          ...tokenFields
        }
      }
      ${TokenFragment}
    `,
    TOKEN: gql`
      query Token($address: ID!, $pair: ID!, $baseTokens: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }

        nativePairDayDatas: pairDayDatas(
          orderBy: date
          orderDirection: desc
          where: { token0_in: $baseTokens, token1_in: $baseTokens }
          first: 2
        ) {
          token0 {
            address: id
          }
          reserve0
          reserve1
          token1 {
            address: id
          }
        }

        pairDayDatas(orderBy: date, orderDirection: desc, where: { pair: $pair }, first: 2) {
          reserve0
          reserve1
        }

        pair(id: $pair) {
          ...pairFields
        }
        token(id: $address) {
          ...tokenFields

          dayData: dayData(orderBy: date, orderDirection: desc, first: 2) {
            ...dayDataFields
          }

          sevenDayData: dayData(orderBy: date, orderDirection: desc, first: 7) {
            ...dayDataFields
          }
        }
      }
      ${TokenFragment}
      ${PairFragment}
      ${DayDataFragment}
    `,
    TOKENS_HISTORICAL: gql`
      query Token($first: Int!, $skip: Int!, $pair: ID!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        pair(id: $pair) {
          ...pairFields
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
            blockNumber
            timestamp
          }
          id
          amount0In
          amount0Out
          amount1In
          amount1Out
          amountUSD
          to
          from: sender
          sender
        }
      }
      ${PairFragment}
    `,
    TRANSACTIONS: gql`
      query GetTransactionTimestamps($transactionIds: [ID!]!) {
        transactions(where: { id_in: $transactionIds }) {
          id
          blockNumber
          timestamp
        }
      }
    `,
    TOKEN_MINTS: gql`
      query Mint($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0
          amount1
          amountUSD
          to
          sender
        }
      }
      ${PairFragment}
    `,
    MINTS: gql`
      query Mint($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0
          amount1
          amountUSD
          to
          sender
        }
      }
      ${PairFragment}
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0In
          amount0Out
          amount1In
          amount1Out
          amountUSD
          to
          from: sender
          sender
        }
      }
      ${PairFragment}
    `,
    SWAPS: gql`
      query Swaps($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        swaps(first: $first) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0In
          amount0Out
          amount1In
          amount1Out
          amountUSD
          to
          from: sender
          sender
        }
      }
      ${PairFragment}
    `,
    TOKEN_BURNS: gql`
      query Burn($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        burns(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0
          amount1
          amountUSD
          to
          sender
        }
      }
      ${PairFragment}
    `,
    BURNS: gql`
      query Burns($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        burns(first: $first) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            ...pairFields
          }
          id
          amount0
          amount1
          amountUSD
          to
          sender
        }
      }
      ${PairFragment}
    `,
    FACTORY: gql`
      query Factories {
        sushi: factories(first: 1) {
          id
          totalPairs: pairCount
          totalTransactions: txCount
          totalVolumeUSD: volumeUSD
          totalVolumeETH: volumeETH
          totalLiquidityETH: liquidityETH
          totalLiquidityUSD: liquidityUSD
        }
      }
    `,
  },
}
