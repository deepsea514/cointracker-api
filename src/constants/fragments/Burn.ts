import { gql } from 'graphql-request'

export const BurnFragment = gql`
  fragment burnFields on Burn {
    id
    amount0
    amount1
    amountUSD
    to
    sender
  }
`
