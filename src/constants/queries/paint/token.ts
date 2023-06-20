import { gql } from 'graphql-request'
import { PairFragment } from '../../fragments/Pair'
import { TokenExtendedPaintFragment } from '../../fragments/Token'

export const TOKEN = gql`
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
