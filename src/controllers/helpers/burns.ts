import subgraphHelper from '../../utils/subgraph/subgraph'
import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import { BadRequestError } from '../../utils/CustomErrors'
import { getOrSetCache } from '../../cache/redis'
import { getExchangeDetailsByName } from '../../utils/dataHelpers'
import { findMostLiquidExchange } from '../../utils/web3/cacheHelpers'
import { getChainConfiguration } from '../../utils/chain/chainConfiguration'
import web3Helper from '../../utils/web3/helpers'
import { AbiItem } from 'web3-utils'
import { UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ABI_V3 } from '../../constants/web3_constants'
import { formatBurns } from '../../utils/formatters'

export const getBurns = async (chainId: CHAINS, exchange: EXCHANGES, limit: number = 15) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  const chain = getChainConfiguration(chainId)
  if (!subgraph || !chainId || !exchange) throw new BadRequestError('Invalid configuration error.')
  if (!limit || isNaN(limit)) limit = 15

  const burnsData = await getOrSetCache(`burns?chainId=${chainId}&exchange=${exchange}&limit=${limit}`, async () => {
    const { burns, bundle } = await subgraphHelper.getDataByQuery({
      client: subgraph.CLIENT,
      query: subgraph.QUERIES.BURNS,
      variables: { first: limit },
    })
    return { burns, bundle }
  })

  const burns = await formatBurns({ burns: burnsData, chain, exchange })

  return burns
}

export const getTokenBurns = async (
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
  const pair = await web3Helper.getPairAddress(address, chain.tokens.NATIVE, contract, isV3)

  const burnsData = await getOrSetCache(
    `burns?address=${address}&chainId=${chainId}&exchange=${exchangeDetails.name}&limit=${limit}`,
    async () => {
      const { burns, bundle } = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKEN_BURNS,
        variables: { first: limit, pairs: [pair.toLowerCase()] },
      })
      return { burns, bundle }
    },
  )

  const burns = await formatBurns({ burns: burnsData, chain, exchange: exchangeDetails.name })

  return burns
}

export default {
  getBurns,
  getTokenBurns,
}
