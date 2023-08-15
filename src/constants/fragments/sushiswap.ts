import { gql } from 'graphql-request'

export const DayDataFragment = gql`
  fragment dayDataFields on TokenDayData {
    txCount
    volume
    volumeUSD
    volumeETH
    liquidity
    liquidityETH
    liquidityUSD
    priceUSD
    date
  }
`
export const TokenFragment = gql`
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
  }
`
export const PairFragment = gql`
  fragment pairFields on Pair {
    pairAddress: id
    id
    reserve0
    reserve1
    reserveUSD
    token0Price
    token1Price
    token0 {
      ...tokenFields
    }
    token1 {
      ...tokenFields
    }
    createdAtTimestamp: timestamp
    createdAtBlockNumber: block
  }
  ${TokenFragment}
`
