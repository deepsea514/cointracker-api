import Big from 'big.js'
import { CHAINS } from '../../constants/constants'
import web3Helper from './helpers'
import subgraphHelper from '../subgraph/subgraph'

// Moved these functions out of dataFetchHelper and saved them here in case we need them again?

export async function mergeTimestampsIntoTransactions({ data, subgraph }: any) {
  const transactionIds = data.map((s: any) => s.transaction.id)
  const { transactions: transactionDetails } = await subgraphHelper.getDataByQuery({
    client: subgraph.CLIENT,
    query: subgraph.QUERIES.TRANSACTIONS,
    variables: { transactionIds: transactionIds },
  })

  return data.map((original: any) => {
    return {
      ...original,
      transaction: transactionDetails.find((t: any) => t.id === original.transaction.id),
    }
  })
}

export async function fetchPaginatedDataFromWeb3({ startingBlock, subgraph, from, pair, tokenContract, chain }: any) {
  // We have maxed out the available data on the-graph, so we will continue to backfill
  // using web3 we will attempt to paginate & fetch the older data
  let pageNumber = 1
  let web3ToBlock = startingBlock
  let swaps = []

  while (true) {
    pageNumber++

    // Roughly 30 minutes of transactions
    // 1 ftm block = 1 second
    // 1 bsc block = 3 seconds
    // 1 eth block = 13 seconds
    const BLOCKS_PER_REQUEST_PER_CHAIN = {
      // [`${CHAINS.ETH}`]: 280,
      // [`${CHAINS.BSC}`]: 1200,
      [`${CHAINS.PLS}`]: 1200,
      [`${CHAINS.NATIVE}`]: 1200,
      // [`${CHAINS.FTM}`]: 3600,
    }

    const blocksPerRequest = BLOCKS_PER_REQUEST_PER_CHAIN[`${chain.chainId}`] // this number depends on what network. 500 is only good for fantom
    const toBlock = web3ToBlock
    const fromBlock = toBlock - blocksPerRequest
    web3ToBlock = fromBlock // update for next cycle

    if (pageNumber % 5 == 0) {
      const subgraphURLSplit = subgraph.URL.split('/')
      console.log({
        pageNumber,
        fromBlock,
        toBlock,
        subgraph: `${subgraphURLSplit[subgraphURLSplit.length - 2]}/${subgraphURLSplit[subgraphURLSplit.length - 1]}`,
        pair: `${pair?.token0?.symbol}-${pair?.token1?.symbol}`,
      })
    }

    const swapData = (await web3Helper.getPastEvents(tokenContract, 'Swap', fromBlock, toBlock)).map((d) => ({
      amount0In: new Big(+d.returnValues.amount0In).div(10 ** +pair.token0.decimals).toString(),
      amount0Out: new Big(+d.returnValues.amount0Out).div(10 ** +pair.token0.decimals).toString(),
      amount1In: new Big(+d.returnValues.amount1In).div(10 ** +pair.token1.decimals).toString(),
      amount1Out: new Big(d.returnValues.amount1Out).div(10 ** +pair.token1.decimals).toString(),
      transaction: {
        blockNumber: `${d.blockNumber}`,
        timestamp: '', // will need to fill in later
        id: d.transactionHash,
      },
    }))

    const swapDataWithTimestamps = await mergeTimestampsIntoTransactions({ data: swapData, subgraph })

    swaps.push(...swapDataWithTimestamps)

    // Check if timestamp is beyond our required scope. if so, exit
    const fromBlockTimestamp = Number((await chain.web3.eth.getBlock(fromBlock)).timestamp) * 1000

    if (new Date(fromBlockTimestamp) < new Date(from)) {
      console.log('Page Number Done')
      break
    }
  }

  return swaps
}
