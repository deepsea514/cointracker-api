import { gql, GraphQLClient } from 'graphql-request'
import { BurnFragment } from '../../fragments/Burn'
import { MintFragment } from '../../fragments/Mint'
import { PairFragment, PairFragmentExtended } from '../../fragments/Pair'
import { SwapAmountFragment } from '../../fragments/Swap'
import { TokenExtendedFragmentShiba } from '../../fragments/Token'
import { TransactionFragment } from '../../fragments/Transaction'

export const SHIBA_SWAP_CONFIG = {
  URL: 'https://api.thegraph.com/subgraphs/name/shiba-fantom/exchange',
  CLIENT: new GraphQLClient('https://api.thegraph.com/subgraphs/name/shiba-fantom/exchange'),
  QUERIES: {
    PAIRS: gql`
      query Pair($token: String!) {
        pair0: pairs(where: { token0: $token }) {
          pairAddress: id
          token0 {
            address: id
            symbol
          }
          token1 {
            address: id
            symbol
          }
          createdAtTimestamp
          createdAtBlockNumber
        }

        pair1: pairs(where: { token1: $token }) {
          pairAddress: id
          token0 {
            address: id
            symbol
          }
          token1 {
            address: id
            symbol
          }
          createdAtTimestamp
          createdAtBlockNumber
        }
      }
    `,
    TOKENS: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }

        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          ...tokenFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${PairFragment}
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          address: id
          symbol
          name
          decimals
          volume: tradeVolume
          volumeUSD: tradeVolumeUSD
          txCount
          liquidity: totalLiquidity
          derivedETH: derivedFTM
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }
        }
      }
    `,
    TOKEN: gql`
      query Token($address: ID!, $pair: ID!, $baseTokens: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
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

        pairDayDatas(orderBy: date, orderDirection: desc, where: { pairAddress: $pair }, first: 2) {
          reserve0
          reserve1
        }

        pair(id: $pair) {
          ...pairFields
        }
        token(id: $address) {
          ...tokenFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${PairFragment}
    `,
    TOKEN_7_DAY_DATA: gql`
      query Token($address: String!) {
        sevenDayData: tokenDayDatas(where: { token: $address }, orderBy: date, orderDirection: desc, first: 7) {
          txCount: dailyTxns
          volume: dailyVolumeToken
          volumeUSD: dailyVolumeUSD
          volumeETH: dailyVolumeETH
          liquidity: totalLiquidityToken
          liquidityETH: totalLiquidityETH
          liquidityUSD: totalLiquidityUSD
          priceUSD
          date
        }
      }
    `,
    TOKENS_HISTORICAL: gql`
      query GetSwaps($first: Int!, $skip: Int!, $pair: ID!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
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
            ...transactionFields
          }
          ...swapFields
        }
      }
      ${PairFragment}
      ${TransactionFragment}
      ${SwapAmountFragment}
    `,
    TRANSACTIONS: gql`
      query GetTransactionTimestamps($transactionIds: [ID!]!) {
        transactions(where: { id_in: $transactionIds }) {
          ...transactionFields
        }
      }
      ${TransactionFragment}
    `,
    TOKEN_MINTS: gql`
      query Mint($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          ...mintFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${MintFragment}
    `,
    MINTS: gql`
      query Mint($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          ...mintFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${MintFragment}
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          id
          ...swapFields
        }
      }
      ${SwapAmountFragment}
      ${TransactionFragment}
      ${TokenExtendedFragmentShiba}
      ${PairFragmentExtended}
    `,
    SWAPS: gql`
      query Swaps($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        swaps(first: $first) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          id
          ...swapFields
        }
      }
      ${SwapAmountFragment}
      ${TransactionFragment}
      ${TokenExtendedFragmentShiba}
      ${PairFragmentExtended}
    `,
    TOKEN_BURNS: gql`
      query Burn($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        burns(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          ...burnFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${BurnFragment}
    `,
    BURNS: gql`
      query Burns($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        burns(first: $first) {
          transaction {
            ...transactionFields
          }
          pair {
            token0 {
              ...tokenFields
            }
            token1 {
              ...tokenFields
            }
            ...pairFields
          }
          ...burnFields
        }
      }
      ${TokenExtendedFragmentShiba}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${BurnFragment}
    `,
    FACTORY: gql`
      query UniswapFactories {
        shiba: uniswapFactories(first: 1) {
          id
          totalPairs: pairCount
          totalTransactions: txCount
          totalVolumeUSD
          totalVolumeFTM
          totalLiquidityFTM
          totalLiquidityUSD
        }
      }
    `,
  },
}
