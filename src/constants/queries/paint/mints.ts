import { gql } from 'graphql-request'

export const MINTS = gql`
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
`
