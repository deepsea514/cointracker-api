import { gql, GraphQLClient } from 'graphql-request'

export const UNISWAP_V2_CONFIG = {
  URL: 'https://gateway-arbitrum.network.thegraph.com/api/a9dac4bec1dddd319ef383ee54f06c6c/subgraphs/id/FEtpnfQ1aqF8um2YktEkfzFD11ZKrfurvBLPeQzv9JB1',
  CLIENT: new GraphQLClient(
    'https://gateway-arbitrum.network.thegraph.com/api/a9dac4bec1dddd319ef383ee54f06c6c/subgraphs/id/FEtpnfQ1aqF8um2YktEkfzFD11ZKrfurvBLPeQzv9JB1',
    {
      headers: { 'content-type': 'application/graphql' },
    },
  ),
  QUERIES: {
    PAIRS: gql`
      query Pair($token: String!) {
        pair0: pairs(where: { token0: $token }, orderBy: volumeUSD, orderDirection: desc) {
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
        pair1: pairs(where: { token1: $token }, orderBy: volumeUSD, orderDirection: desc) {
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
          chainPrice: ethPrice
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
          derivedETH
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
      }
    `,
    TOKENS_WITHOUT_SEVEN_DAY_DATA: gql`
      query Token($first: Int) {
        bundle(id: 1) {
          id
          chainPrice: ethPrice
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
          derivedETH
        }
      }
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
          token1 {
            address: id
          }
          reserve0
          reserve1
        }

        pairDayDatas(orderBy: date, orderDirection: desc, where: { pairAddress: $pair }, first: 90) {
          reserve0
          reserve1
          txCount: dailyTxns
          tvlUSD: reserveUSD
          volumeUSD: dailyVolumeUSD
        }

        pairHourDatas(orderBy: hourStartUnix, orderDirection: desc, where: { pair: $pair }, first: 25) {
          txCount: hourlyTxns
          tvlUSD: reserveUSD
          volumeUSD: hourlyVolumeUSD
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
          totalSupply
          volume: tradeVolume
          volumeUSD: tradeVolumeUSD
          txCount
          liquidity: totalLiquidity
          derivedETH
          dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
            txCount: dailyTxns
            volume: dailyVolumeToken
            liquidity: totalLiquidityToken
          }

          sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
      query Mint($first: Int, $pairs: [ID!]!) {
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
            token0 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
          chainPrice: ethPrice
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
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
          chainPrice: ethPrice
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
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
        bundle(id: 1) {
          id
          chainPrice: ethPrice
        }
        swaps(first: $first) {
          id
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            id
            token0 {
              address: id
              symbol
              decimals
              totalSupply
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
            }
            token1 {
              address: id
              symbol
              decimals
              totalSupply
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
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

    TOKEN_BURNS: gql`
      query Burns($first: Int, $pairs: [ID!]!) {
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
            id
            token0 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
            token1 {
              address: id
              symbol
              name
              decimals
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
              dayData: tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
                txCount: dailyTxns
                volume: dailyVolumeToken
                liquidity: totalLiquidityToken
              }

              sevenDayData: tokenDayData(orderBy: date, orderDirection: desc, first: 7) {
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
          chainPrice: ethPrice
        }
        burns(first: $first) {
          id
          transaction {
            id
            blockNumber
            timestamp
          }
          pair {
            id
            token0 {
              address: id
              symbol
              decimals
              totalSupply
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
            }
            token1 {
              address: id
              symbol
              decimals
              totalSupply
              volume: tradeVolume
              volumeUSD: tradeVolumeUSD
              txCount
              liquidity: totalLiquidity
              derivedETH
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
          to
          sender
        }
      }
    `,
    FACTORY: gql`
      query Factories {
        Uniswap-V2: uniswapFactories(first: 1) {
          id
          totalPairs: pairCount
          totalTransactions: txCount
          totalVolumeUSD
          totalVolumeETH
          totalLiquidityETH
          totalLiquidityUSD
        }
      }
    `,
  },
}
