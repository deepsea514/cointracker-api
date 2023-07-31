import { gql, GraphQLClient } from 'graphql-request'

export const FUSION_DEX_CONFIG = {
  URL: 'https://graph.fusionx.finance/subgraphs/name/fusionx/exchange',
  CLIENT: new GraphQLClient('https://graph.fusionx.finance/subgraphs/name/fusionx/exchange', {
    headers: { 'content-type': 'application/graphql' },
  }),
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
          timestamp
          block
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
          timestamp
          block
        }
      }
    `,
    TOKENS: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: nativePrice
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
          derivedETH: derivedNATIVE
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            volumeUSD: dailyVolumeUSD
            volumeNATIVE: dailyVolumeNATIVE
            liquidity: totalLiquidityToken
            liquidityNATIVE: totalLiquidityNATIVE
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
          chainPrice: nativePrice
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
          derivedETH: derivedNATIVE
        }
      }
    `,
    TOKEN: gql`
      query Token($address: ID!, $pair: ID!, $baseTokens: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: nativePrice
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
          txCount: totalTransactions
          liquidity: totalLiquidity
          derivedETH: derivedNATIVE
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            volumeUSD: dailyVolumeUSD
            volumeNATIVE: dailyVolumeNATIVE
            liquidity: totalLiquidityToken
            liquidityNATIVE: totalLiquidityNATIVE
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
    `,
    TRANSACTIONS: gql`
      query GetTransactionTimestamps($transactionIds: [ID!]!) {
        transactions(where: { id_in: $transactionIds }) {
          id
          blockNumber: block
          timestamp
        }
      }
    `,
    TOKEN_MINTS: gql`
      query Mint($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: nativePrice
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
    `,
    MINTS: gql`
      query Mint($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: nativePrice
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: nativePrice
        }
        swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pair_in: $pairs }) {
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
              derivedETH: derivedNATIVE
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                volumeUSD: dailyVolumeUSD
                volumeNATIVE: dailyVolumeNATIVE
                liquidity: totalLiquidityToken
                liquidityNATIVE: totalLiquidityNATIVE
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
        swaps(first: $first) {
          id
          pair {
            id
            token0 {
              id
              symbol
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              txCount
              totalLiquidity
              derivedNATIVE
            }
            token1 {
              id
              symbol
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              txCount
              totalLiquidity
              derivedNATIVE
            }
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          amount0In
          amount0Out
          amount1Out
          amount1In
          amountUSD
        }
      }
    `,
    TOKEN_BURNS: gql``,
    BURNS: gql`
      query Burns($first: Int) {
        burns(first: $first) {
          id
          pair {
            id
            token0 {
              id
              symbol
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              txCount
              totalLiquidity
              derivedNATIVE
            }
            token1 {
              id
              symbol
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              txCount
              totalLiquidity
              derivedNATIVE
            }
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          amount0
          amount1
          amountUSD
        }
      }
    `,
    FACTORY: gql`
      query fusionXFactories {
        fusion: fusionXFactories(first: 1) {
          id
          totalPairs
          totalTransactions
          totalVolumeUSD
          totalVolumeNATIVE
          totalLiquidityNATIVE
          totalLiquidityUSD
        }
      }
    `,
  },
}
