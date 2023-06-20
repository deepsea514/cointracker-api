import { gql } from 'graphql-request'

export const TokenDatDataFragment = gql`
  fragment tokeDayDataFields on TokenDayData {
    txCount
    volume
    liquidity
  }
`

export const TokenDatDataFragmentSpirit = gql`
  fragment tokeDayDataFields on TokenDayData {
    txCount: dailyTxns
    volume: dailyVolumeToken
    liquidity: totalLiquidityToken
  }
`
