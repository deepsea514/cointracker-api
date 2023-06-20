import { gql } from 'graphql-request'

export const TOKENS = gql`
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
`
