import { gql, GraphQLClient } from 'graphql-request'
import { BurnFragment } from '../../fragments/Burn'
import { MintFragment } from '../../fragments/Mint'
import { PairFragment, PairFragmentExtended } from '../../fragments/Pair'
import { SwapAmountFragment, SwapAmountFragmentUni } from '../../fragments/Swap'
import { TokenExtendedFragmentUni } from '../../fragments/Token'
import { TransactionFragment } from '../../fragments/Transaction'

export const UNISWAP_CONFIG = {
  URL: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  CLIENT: new GraphQLClient('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'),
  QUERIES: {
    PAIRS: gql``,
    TOKENS: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }

        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          ...tokenFields
        }
      }
      ${TokenExtendedFragmentUni}
      ${PairFragment}
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: bnbPrice
        }
        tokens(first: $first, orderBy: totalTransactions, orderDirection: desc) {
          address: id
          symbol
          name
          decimals
          volume: tradeVolume
          volumeUSD: tradeVolumeUSD
          txCount: totalTransactions
          liquidity: totalLiquidity
          derivedETH: derivedBNB
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }
        }
      }
    `,
    TOKEN: gql`
      query Token($address: ID!, $pair: String!, $baseTokens: [ID!]!) {
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

        pairDayDatas(orderBy: date, orderDirection: desc, where: { pairAddress: $pair }, first: 2) {
          reserve0
          reserve1
        }

        # nativePair: pairs(first: 1, where: { token0_in: $baseTokens, token1_in: $baseTokens }) {
        #   ...pairFields
        # }

        pair(id: $pair) {
          ...pairFields
        }
        token(id: $address) {
          ...tokenFields
        }
      }
      ${TokenExtendedFragmentUni}
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
      query GetSwaps($first: Int!, $skip: Int!, $pair: String!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
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
            ...transactionFields
          }
          ...swapFields
        }
      }
      ${PairFragment}
      ${TransactionFragment}
      ${SwapAmountFragmentUni}
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
      query Mint($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
      ${TokenExtendedFragmentUni}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${MintFragment}
    `,
    MINTS: gql`
      query Mint($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
      ${TokenExtendedFragmentUni}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${MintFragment}
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
      ${SwapAmountFragmentUni}
      ${TransactionFragment}
      ${TokenExtendedFragmentUni}
      ${PairFragmentExtended}
    `,
    SWAPS: gql`
      query Swaps($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
      ${SwapAmountFragmentUni}
      ${TransactionFragment}
      ${TokenExtendedFragmentUni}
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
      ${TokenExtendedFragmentUni}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${BurnFragment}
    `,
    BURNS: gql`
      query Burns($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
      ${TokenExtendedFragmentUni}
      ${TransactionFragment}
      ${PairFragmentExtended}
      ${BurnFragment}
    `,
    FACTORY: gql`
      query UniswapFactories {
        uni: uniswapFactories(first: 1) {
          id
          totalPairs: pairCount
          totalTransactions: txCount
          totalVolumeUSD
          totalVolumeFTM: totalVolumeETH
          totalLiquidityFTM: totalLiquidityETH
          totalLiquidityUSD
        }
      }
    `,
  },
}
