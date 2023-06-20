import { gql } from 'graphql-request'

export const TokenExtendedFragmentShiba = gql`
  fragment tokenFields on Token {
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
`
