import { gql } from 'graphql-request'

export const MintFragment = gql`
  fragment mintFields on Mint {
    id
    amount0
    amount1
    amountUSD
    to
    sender
  }
`
