import { gql } from 'graphql-request'

export const TokenExtendedFragment = gql`
  fragment tokenFields on Token {
    address: id
    symbol
    name
    decimals
    volume
    volumeUSD
    txCount
    liquidity
    derivedETH
    # Get 2 so we can calculate the last 24 hour change
    dayData(orderBy: date, orderDirection: desc, first: 2) {
      txCount
      volume
      liquidity
    }

    sevenDayData: dayData(orderBy: date, orderDirection: desc, first: 7) {
      txCount
      volume
      volumeUSD
      volumeFTM: volumeETH
      liquidity
      liquidityUSD
      liquidityFTM: liquidityETH
      priceUSD
      date
    }
  }
`

export const TokenExtendedFragmentUni = gql`
  fragment tokenFields on Token {
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
      volumeFTM: dailyVolumeETH
      liquidity: totalLiquidityToken
      liquidityFTM: totalLiquidityETH
      liquidityUSD: totalLiquidityUSD
      priceUSD
      date
    }
  }
`

export const TokenExtendedSpiritFragment = gql`
  fragment tokenFields on Token {
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
      volumeFTM: dailyVolumeETH
      liquidity: totalLiquidityToken
      liquidityFTM: totalLiquidityETH
      liquidityUSD: totalLiquidityUSD
      priceUSD
      date
    }
  }
`
export const TokenExtendedPancakeFragment = gql`
  fragment tokenFields on Token {
    address: id
    symbol
    name
    decimals
    volume: tradeVolume
    volumeUSD: tradeVolumeUSD
    txCount
    liquidity: totalLiquidity
    derivedETH: derivedBNB
  }
`

export const TokenExtendedPaintFragment = gql`
  fragment tokenFields on Token {
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
`
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
