export const swaps = ({ first = 30 }) =>
  JSON.stringify({
    variables: { first },
    query: `query Swaps($first: Int) {
    swaps(first: $first) {
        id
        transaction {
            id
            blockNumber
            timestamp
        }
        to
        from
        sender
        amountUSD
        amount0In
        amount1In
        amount0Out
        amount1Out
        pair {
            id
            reserveUSD
            token0Price
            token0 {
                id
                name
                symbol
            }
            token1Price
            token1 {
                id
                name
                symbol
            }
        }
    }
}`,
  })

export const burns = ({ first = 30 }) =>
  JSON.stringify({
    variables: { first },
    query: `query Burns($first: Int) {
            burns(first: $first) {
                id
                pair {
                    id
                    token0 {
                        id
                        symbol
                        decimals
                        totalSupply
                        tradeVolume
                        tradeVolumeUSD
                        txCount
                        totalLiquidity
                        derivedETH
                    }
                    token1 {
                        id
                        symbol
                        decimals
                        totalSupply
                        tradeVolume
                        tradeVolumeUSD
                        txCount
                        totalLiquidity
                        derivedETH
                    }
                    token0Price
                    token1Price
                    volumeToken0
                    volumeToken1
                    volumeUSD
                    createdAtTimestamp
                    createdAtBlockNumber
                }
                amount0
                amount1
                amountUSD
            }
    }`,
  })

export const mints = ({ first = 30 }) =>
  JSON.stringify({
    variables: { first },
    query: `query Mints($first: Int) {
            mints(first: $first, orderBy: timestamp, orderDirection: desc) {
                id
                pair {
                    id
                    token0 {
                        id
                        symbol
                        decimals
                        totalSupply
                        tradeVolume
                        tradeVolumeUSD
                        txCount
                        totalLiquidity
                        derivedETH
                    }
                    token1 {
                        id
                        symbol
                        decimals
                        totalSupply
                        tradeVolume
                        tradeVolumeUSD
                        txCount
                        totalLiquidity
                        derivedETH
                    }
                    token0Price
                    token1Price
                    volumeToken0
                    volumeToken1
                    volumeUSD
                    createdAtTimestamp
                    createdAtBlockNumber
                }
                amount0
                amount1
                amountUSD
            }
    }`,
  })
