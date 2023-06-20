import { gql } from 'graphql-request'

export const TRANSACTIONS = gql`
  query GetTransactionTimestamps($transactionIds: [ID!]!) {
    transactions(where: { id_in: $transactionIds }) {
      id
      blockNumber: block
      timestamp
    }
  }
`
