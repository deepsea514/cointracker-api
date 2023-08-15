import { TOKENS, UNISWAP_FACTORY_ABI, UNISWAP_PAIR_ABI } from '../../constants/web3_constants'
import { AbiItem } from 'web3-utils'
import subgraphHelper from './subgraph'
import web3Helper from '../web3/helpers'
import { PairUnavailableError, SubgraphError } from '../CustomErrors'
import { compareAddress } from '../web3/address'
import { GraphQLClient } from 'graphql-request'
import { IChainConfiguration } from '../chain/chainConfiguration'

async function fetchPaginatedDataFromGraphQL_ALT({ first, subgraph, pair, to, from }: any) {
  // This should be a do-while. Get the initial page of data from graphql
  // then repeat until we have the maximum amount of data the graphql will return
  // (or until we have all the data we need)
  let data: any = null
  let skip = 0
  let requiresPagination = false
  const GRAPHQL_MAX_SKIPPED = 5000

  let currentTo = Math.floor(to / 1000)
  let currentFrom = Math.floor(from / 1000)
  do {
    let MAX_RETRIES = 5
    let pause = 5000
    let retries = 0
    let shouldRetry = false
    let results: any
    innerLoop: do {
      try {
        results = await subgraphHelper.getDataByQuery({
          client: subgraph.CLIENT,
          query: subgraph.QUERIES.TOKENS_HISTORICAL,
          variables: {
            first,
            skip: 0,
            pair: pair.toLowerCase(),
            timestamp_lte: currentTo,
            timestamp_gte: currentFrom,
          },
        })
        shouldRetry = false
      } catch (err: any) {
        shouldRetry = ++retries < MAX_RETRIES ? true : false
        if (shouldRetry) {
          console.log(`Data fetch failed because ${err.message}, retrying: ${retries}/${MAX_RETRIES}`)
        } else {
          console.log(`Failed to fetch swaps after ${retries} retries, exiting.`)
          throw new SubgraphError(err.message)
        }
      }
    } while (shouldRetry)

    // Update the most recent target to be the last timestamp available
    if (results?.swaps?.length) {
      currentTo = results.swaps.slice(-1)[0].transaction.timestamp
    }

    if (!data) {
      // Initialize all the data
      data = results
    } else {
      // Update the swaps
      data.swaps.push(...results?.swaps)
    }

    console.log(
      `Retrieved: ${data?.swaps?.length} swaps, latest swap at ${new Date(currentTo * 1000).toLocaleString()}`,
    )

    // If the swaps count is exactly 1000 then its safe to assume we need the next
    requiresPagination = results?.swaps?.length === first && skip <= GRAPHQL_MAX_SKIPPED
  } while (requiresPagination)

  return [data]
}

export async function fetchTokenHistoricalDataBetweenTimeStamps(
  token0: string,
  token1: string,
  subgraph: {
    CLIENT: GraphQLClient
    QUERIES: {
      TOKENS: string
      TOKENS_HISTORICAL: string
      MINTS: string
      SWAPS: string
      BURNS: string
    }
  },
  chain: IChainConfiguration,
  factory: string,
  from: number,
  to: number,
) {
  // Use Web3 to get the chains NATIVE-STABLE pair address & contract
  // Pair is used in the graphql query, but the contract isn't used unless
  // we need to fetch further data with web3
  const factoryContract = web3Helper.getContract(UNISWAP_FACTORY_ABI as AbiItem[], factory, chain.web3)
  const tokenNativePair = (await web3Helper.getPairAddress(token0, token1, factoryContract)).toLowerCase()
  // can only get a maximum of 1000 from the subgraph at a time (may return less)
  // we need to get the full 1000 since we can't know how many tx took place per block/time-frame
  const limit = 1000
  if (compareAddress(tokenNativePair, TOKENS.ZERO, chain.web3)) {
    throw new PairUnavailableError(
      `Could not find a pair for this token on ${chain.chainId}. token0: ${token0} - token1: ${token1}`,
    )
  }

  const [data] = await fetchPaginatedDataFromGraphQL_ALT({
    first: limit,
    subgraph,
    pair: tokenNativePair,
    to,
    from,
  })

  return data
}

export async function fetchTokenHistoricalDataBetweenTimeStampsV3(
  token0: string,
  token1: string,
  subgraph: {
    CLIENT: GraphQLClient
    QUERIES: {
      TOKENS: string
      TOKENS_HISTORICAL: string
      MINTS: string
      SWAPS: string
      BURNS: string
    }
  },
  chain: IChainConfiguration,
  factory: string,
  from: number,
  to: number,
) {
  // Use Web3 to get the chains NATIVE-STABLE pair address & contract
  // Pair is used in the graphql query, but the contract isn't used unless
  // we need to fetch further data with web3
  const factoryContract = web3Helper.getContract(UNISWAP_FACTORY_ABI as AbiItem[], factory, chain.web3)
  const tokenNativePair = (await web3Helper.getPairAddressV3(token0, token1, factoryContract)).toLowerCase()
  // can only get a maximum of 1000 from the subgraph at a time (may return less)
  // we need to get the full 1000 since we can't know how many tx took place per block/time-frame
  const limit = 1000
  if (compareAddress(tokenNativePair, TOKENS.ZERO, chain.web3)) {
    throw new PairUnavailableError(
      `Could not find a pair for this token on ${chain.chainId}. token0: ${token0} - token1: ${token1}`,
    )
  }

  const [data] = await fetchPaginatedDataFromGraphQL_ALT({
    first: limit,
    subgraph,
    pair: tokenNativePair,
    to,
    from,
  })

  return data
}
