import { gql, GraphQLClient } from 'graphql-request'

export const SPIRIT_SWAP_CONFIG = {
  URL: 'https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics',
  CLIENT: new GraphQLClient('https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics'),
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
        token(id: $address) {
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
      query Token($first: Int!, $skip: Int!, $pair: ID!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
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
          from
          sender
        }
      }
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
          chainPrice: ftmPrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
    `,
    SWAPS: gql`
      query Swaps($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        swaps(first: $first) {
          transaction {
            id
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
    `,
    TOKEN_BURNS: gql`
      query Burn($first: Int, $pairs: [String!]!) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        burns(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
          transaction {
            id
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
    `,
    BURNS: gql`
      query Burns($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ftmPrice
        }
        burns(first: $first) {
          transaction {
            id
            blockNumber
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
              txCount
              liquidity: totalLiquidity
              derivedETH: derivedFTM
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }
            }
            token1 {
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
    `,
    FACTORY: gql`
      query UniswapFactories {
        spirit: uniswapFactories(first: 1) {
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
