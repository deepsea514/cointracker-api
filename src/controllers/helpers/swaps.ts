import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import subgraphHelper from '../../utils/subgraph/subgraph'
import web3Helper from '../../utils/web3/helpers'
import { AbiItem } from 'web3-utils'
import { BadRequestError } from '../../utils/CustomErrors'
import { getOrSetCache } from '../../cache/redis'
import { getExchangeDetailsByName } from '../../utils/dataHelpers'
import { findMostLiquidExchange } from '../../utils/web3/cacheHelpers'
import { getChainConfiguration } from '../../utils/chain/chainConfiguration'
import { UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ABI_V3 } from '../../constants/web3_constants'
import { formatSwaps } from '../../utils/formatters'

export const getSwaps = async (chainId: CHAINS, exchange: EXCHANGES, limit: number = 15) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  const chain = getChainConfiguration(chainId)
  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const isV3 = exchange.includes('V3')

  const swapsData = await getOrSetCache(`swaps?chainId=${chainId}&exchange=${exchange}&limit=${limit}`, async () => {
    const data = await subgraphHelper.getDataByQuery({
      client: subgraph.CLIENT,
      query: subgraph.QUERIES.SWAPS,
      variables: { first: limit },
    })
    // console.log(data)

    return { swaps: data.swaps, bundle: data.bundle }
  })

  const swaps = await formatSwaps({ swaps: swapsData, chain, exchange, isV3 })

  return swaps
}

export const getTokenSwaps = async (
  chainId: CHAINS,
  exchange: EXCHANGES | null,
  limit: number = 15,
  address: string,
) => {
  const exchangeDetails = exchange
    ? getExchangeDetailsByName(exchange, chainId)
    : await findMostLiquidExchange(address, chainId)

  if (!exchangeDetails?.name) throw new BadRequestError('Invalid configuration error.')

  const chain = getChainConfiguration(chainId)
  const subgraph = SUBGRAPHS[`${chainId}`]?.[exchangeDetails.name]

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const isV3 = exchangeDetails.name.includes('V3')

  const contract = web3Helper.getContract(
    isV3 ? (UNISWAP_FACTORY_ABI_V3 as AbiItem[]) : (UNISWAP_FACTORY_ABI as AbiItem[]),
    exchangeDetails.address,
    chain.web3,
  )
  const stablePair = await web3Helper.getPairAddress(address, chain.tokens.STABLE, contract, isV3)
  const nativePair = await web3Helper.getPairAddress(address, chain.tokens.NATIVE, contract, isV3)
  let pairs: string[] = []
  if (address.toLowerCase() === chain.tokens.STABLE.toLowerCase()) pairs.push(nativePair.toLowerCase())
  else if (address.toLowerCase() === chain.tokens.NATIVE.toLowerCase()) pairs.push(stablePair.toLowerCase())
  else pairs = [stablePair.toLowerCase(), nativePair.toLowerCase()]
  const swapsData = await getOrSetCache(
    `swaps?address=${address}&chainId=${chainId}&exchange=${exchangeDetails.name}&limit=${limit}`,
    async () => {
      const data = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKEN_SWAPS,
        variables: { first: limit, pairs: pairs },
      })
      // console.log(data)

      return { swaps: data.swaps, bundle: data.bundle }
    },
  )

  const swaps = await formatSwaps({ swaps: swapsData, chain, exchange: exchangeDetails.name, isV3 })
  return swaps
}

export default {
  getSwaps,
  getTokenSwaps,
}
