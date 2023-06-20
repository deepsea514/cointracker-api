import { gql } from 'graphql-request'

export const PAIRS = gql`
  query Pair($token: String!) {
    pair0: pairs(where: { token0: $token }) {
      pairAddress: id
      token0 {
        address: id
        symbol
      }
      token1 {
        address: id
        symbol
      }
      createdAtTimestamp: timestamp
      createdAtBlockNumber: block
    }

    pair1: pairs(where: { token1: $token }) {
      pairAddress: id
      token0 {
        address: id
        symbol
      }
      token1 {
        address: id
        symbol
      }
      createdAtTimestamp: timestamp
      createdAtBlockNumber: block
    }
  }
`
