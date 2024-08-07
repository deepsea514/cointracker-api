import { gql, GraphQLClient } from 'graphql-request'

export const HERCULES_V3_CONFIG = {
  URL: 'https://metisapi.0xgraph.xyz/subgraphs/name/cryptoalgebra/analytics',
  CLIENT: new GraphQLClient('https://metisapi.0xgraph.xyz/subgraphs/name/cryptoalgebra/analytics', {
    headers: { 'content-type': 'application/graphql' },
  }),
  QUERIES: {
    PAIRS: gql`
      query Pair($token: String!) {
        pair0: pools(where: { token0: $token }) {
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

        pair1: pools(where: { token1: $token }) {
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
          chainPrice: maticPriceUSD
        }
        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          address: id
          symbol
          name
          decimals
          volume
          volumeUSD
          txCount
          feesUSD
          liquidity: totalValueLocked
          derivedETH: derivedMatic
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            volume
            feesUSD
            liquidity: totalValueLocked
            open
            high
            low
            close
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            volume
            volumeUSD
            liquidity: totalValueLocked
            liquidityUSD: totalValueLockedUSD
            priceUSD
            feesUSD
            date
          }
        }
      }
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        tokens(first: $first, orderBy: txCount, orderDirection: desc) {
          address: id
          symbol
          name
          decimals
          volume
          volumeUSD
          txCount
          liquidity: totalValueLocked
          feesUSD
          derivedETH
        }
      }
    `,
    TOKEN: gql`
      query Token($address: ID!, $pair: ID!, $baseTokens: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: maticPriceUSD
        }

        nativePairDayDatas: poolDayDatas(
          orderBy: date
          orderDirection: desc
          where: { pool_: { token0_in: $baseTokens, token1_in: $baseTokens } }
          first: 2
        ) {
          pool {
            token0 {
              address: id
            }
            token1 {
              address: id
            }
          }
          token0Price
          token1Price
        }

        pairDayDatas: poolDayDatas(orderBy: date, orderDirection: desc, where: { pool: $pair }, first: 2) {
          token0Price
          token1Price
        }

        pair: pool(id: $pair) {
          id
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
          volume
          volumeUSD
          totalSupply
          txCount
          liquidity: totalValueLocked
          derivedETH: derivedMatic
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            volume
            liquidity: totalValueLocked
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
            volume
            volumeUSD
            liquidity: totalValueLocked
            liquidityUSD: totalValueLockedUSD
            priceUSD
            feesUSD
            date
          }
        }
      }
    `,
    TOKEN_7_DAY_DATA: gql`
      query Token($address: String!) {
        sevenDayData: tokenDayDatas(where: { token: $address }, orderBy: date, orderDirection: desc, first: 7) {
          # txCount: dailyTxns
          volume
          volumeUSD
          # volumeETH: dailyVolumeETH
          liquidity: totalValueLocked
          # liquidityETH: totalLiquidityETH
          liquidityUSD: totalValueLockedUSD
          priceUSD
          feesUSD
          date
        }
      }
    `,
    TOKENS_HISTORICAL: gql`
      query GetSwaps($first: Int!, $skip: Int!, $pair: ID!, $timestamp_lte: BigInt!, $timestamp_gte: BigInt!) {
        pair: pool(id: $pair) {
          id
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
          where: { pool: $pair, timestamp_lte: $timestamp_lte, timestamp_gte: $timestamp_gte }
        ) {
          transaction {
            id
            blockNumber
            timestamp
          }
          id
          amount0
          amount1
          price
          amountUSD
          to: recipient
          from: origin
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
      query Mint($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc, where: { pool_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            id
            reserve0: totalValueLockedToken0
            reserve1: totalValueLockedToken1
            reserveUSD: totalValueLockedUSD
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
          to: origin
          sender
        }
      }
    `,
    MINTS: gql`
      query Mint($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        mints(first: $first, orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            id
            reserve0: totalValueLockedToken0
            reserve1: totalValueLockedToken1
            reserveUSD: totalValueLockedUSD
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
          to: origin
          sender
        }
      }
    `,
    TOKEN_SWAPS: gql`
      query Swaps($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pool_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            id
            reserve0: totalValueLockedToken0
            reserve1: totalValueLockedToken1
            reserveUSD: totalValueLockedUSD
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          id
          amount0In: amount0
          # amount0Out
          amount1In: amount1
          # amount1Out
          amountUSD
          to: recipient
          from: origin
          sender
        }
      }
    `,
    SWAPS: gql`
      query Swaps($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        swaps(first: $first) {
          id
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
            }
            id
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          amount0In: amount0
          # amount0Out
          # amount1Out
          amount1In: amount1
          amountUSD
        }
      }
    `,

    TOKEN_BURNS: gql`
      query Burns($first: Int, $pairs: [ID!]!) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        burns(first: $first, orderBy: timestamp, orderDirection: desc, where: { pool_in: $pairs }) {
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                # txCount: dailyTxns
                volume
                liquidity: totalValueLocked
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
                # txCount: dailyTxns
                volume
                volumeUSD
                # volumeETH: dailyVolumeETH
                liquidity: totalValueLocked
                # liquidityETH: totalLiquidityETH
                liquidityUSD: totalValueLockedUSD
                priceUSD
                date
              }
            }
            id
            reserve0: totalValueLockedToken0
            reserve1: totalValueLockedToken1
            reserveUSD: totalValueLockedUSD
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
          to: origin
          sender: owner
        }
      }
    `,
    BURNS: gql`
      query Burns($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPriceUSD
        }
        burns(first: $first) {
          id
          transaction {
            id
            blockNumber
            timestamp
          }
          pair: pool {
            token0 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
            }
            token1 {
              address: id
              symbol
              name
              decimals
              volume
              volumeUSD
              txCount
              liquidity: totalValueLocked
              derivedETH
            }
            id
            token0Price
            token1Price
            volumeToken0
            volumeToken1
            volumeUSD
          }
          amount0
          amount1
          amountUSD
          to: origin
          sender: owner
        }
      }
    `,
    FACTORY: gql`
      query Factories {
        Hercules-V3: factories(first: 1) {
          id
          totalPairs: poolCount
          totalTransactions: txCount
          totalVolumeUSD
          totalVolumeETH
          totalLiquidityETH: totalValueLockedETH
          totalLiquidityUSD: totalValueLockedUSD
        }
      }
    `,
  },
}
