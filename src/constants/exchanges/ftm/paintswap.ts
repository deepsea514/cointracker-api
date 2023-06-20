import { gql, GraphQLClient } from 'graphql-request'
import { BurnFragment } from '../../fragments/Burn'
import { MintFragment } from '../../fragments/Mint'
import { PairFragment, PairFragmentExtended } from '../../fragments/Pair'
import { SwapAmountFragment } from '../../fragments/Swap'
import { TokenExtendedPaintFragment } from '../../fragments/Token'
import { TransactionFragmentPaint } from '../../fragments/Transaction'

export const PAINT_SWAP_CONFIG = {
  URL: 'https://api.thegraph.com/subgraphs/name/paint-swap-finance/exchange',
  CLIENT: new GraphQLClient('https://api.thegraph.com/subgraphs/name/paint-swap-finance/exchange'),
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
          createdAtTimestamp: timestamp
          createdAtBlockNumber: block
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
          createdAtTimestamp: timestamp
          createdAtBlockNumber: block
        }
      }
    `,
    TOKENS: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
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
          derivedETH: derivedFTM
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            volumeUSD: dailyVolumeUSD
            volumeFTM: dailyVolumeFTM
            liquidity: totalLiquidityToken
            liquidityFTM: totalLiquidityFTM
            liquidityUSD: totalLiquidityUSD
            priceUSD
            date
          }
        }
      }
      ${TokenExtendedPaintFragment}
      ${PairFragment}
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
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
          address: id
          symbol
          name
          decimals
          volume: tradeVolume
          volumeUSD: tradeVolumeUSD
          txCount: totalTransactions
          liquidity: totalLiquidity
          derivedETH: derivedFTM
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            volumeUSD: dailyVolumeUSD
            volumeFTM: dailyVolumeFTM
            liquidity: totalLiquidityToken
            liquidityFTM: totalLiquidityFTM
            liquidityUSD: totalLiquidityUSD
            priceUSD
            date
          }
        }
      }
      ${TokenExtendedPaintFragment}
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
      ${SwapAmountFragment}
      ${TransactionFragmentPaint}
    `,
    TRANSACTIONS: gql`
      query GetTransactionTimestamps($transactionIds: [ID!]!) {
        transactions(where: { id_in: $transactionIds }) {
          ...transactionFields
        }
      }
      ${TransactionFragmentPaint}
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
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            ...pairFields
          }
          ...mintFields
        }
      }
      ${TransactionFragmentPaint}
      ${TokenExtendedPaintFragment}
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
            id
            blockNumber: block
            timestamp
          }
          pair {
            token0 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            id
            reserve0
            reserve1
            reserveUSD
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          id
          amount0
          amount1
          amountUSD
          to
          sender
        }
      }
      ${TransactionFragmentPaint}
      ${TokenExtendedPaintFragment}
      ${MintFragment}
      ${PairFragmentExtended}
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
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            ...pairFields
          }
          ...swapFields
        }
      }
      ${SwapAmountFragment}
      ${TransactionFragmentPaint}
      ${TokenExtendedPaintFragment}
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
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            ...pairFields
          }
          ...swapFields
        }
      }
      ${TokenExtendedPaintFragment}
      ${TransactionFragmentPaint}
      ${SwapAmountFragment}
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
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            ...pairFields
          }
          ...burnFields
        }
      }
      ${TokenExtendedPaintFragment}
      ${TransactionFragmentPaint}
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
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount: totalTransactions
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeFTM: dailyVolumeFTM
                liquidity: totalLiquidityToken
                liquidityFTM: totalLiquidityFTM
                liquidityUSD: totalLiquidityUSD
                priceUSD
                date
              }
            }
            ...pairFields
          }
          ...burnFields
        }
      }
      ${TokenExtendedPaintFragment}
      ${TransactionFragmentPaint}
      ${PairFragmentExtended}
      ${BurnFragment}
    `,
    FACTORY: gql`
      query PaintFactories {
        paint: paintFactories(first: 1) {
          id
          totalPairs
          totalTransactions
          totalVolumeUSD
          totalVolumeFTM
          totalLiquidityFTM
          totalLiquidityUSD
        }
      }
    `,
  },
}
