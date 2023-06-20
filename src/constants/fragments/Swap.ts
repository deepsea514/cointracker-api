import { gql } from 'graphql-request'

export const SwapAmountFragmentUni = gql`
  fragment swapFields on Swap {
    id
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    to
    # from
    sender
  }
`

export const SwapAmountFragmentSushi = gql`
  fragment swapFields on Swap {
    id
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    to
    # from
    sender
  }
`
export const SwapAmountFragment = gql`
  fragment swapFields on Swap {
    id
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    to
    from
    sender
  }
`
