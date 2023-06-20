import { gql } from 'graphql-request'

export const TOKEN_SWAPS = gql`
  query Swaps($first: Int, $pairs: [ID!]!) {
    bundle(id: 1) {
      id
      chainPrice: ftmPrice
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
