import { gql } from 'graphql-request'

export const PairFragment = gql`
  fragment pairFields on Pair {
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
`

export const PairFragmentExtended = gql`
  fragment pairFields on Pair {
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
`
