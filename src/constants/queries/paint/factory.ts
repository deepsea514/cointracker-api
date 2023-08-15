import { gql } from 'graphql-request'

export const FACTORY = gql`
  query PaintFactories {
    paint: paintFactories(first: 1) {
      id
      totalPairs
      totalTransactions
      totalVolumeUSD
      totalVolumeFTM
      totalLiquidityFTM
      totalLiquidityUSD
    }
  }
`
