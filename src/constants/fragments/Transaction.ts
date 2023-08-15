import { gql } from 'graphql-request'

export const TransactionFragment = gql`
  fragment transactionFields on Transaction {
    id
    blockNumber
    timestamp
  }
`
export const TransactionFragmentPaint = gql`
  fragment transactionFields on Transaction {
    id
    blockNumber: block
    timestamp
  }
`
