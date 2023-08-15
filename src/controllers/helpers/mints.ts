import subgraphHelper from '../../utils/subgraph/subgraph'
import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import { BadRequestError } from '../../utils/CustomErrors'
import { getOrSetCache } from '../../cache/redis'
import { getExchangeDetailsByName } from '../../utils/dataHelpers'
import { findMostLiquidExchange } from '../../utils/web3/cacheHelpers'
import { getChainConfiguration } from '../../utils/chain/chainConfiguration'
import web3Helper from '../../utils/web3/helpers'
import { AbiItem } from 'web3-utils'
import { UNISWAP_FACTORY_ABI } from '../../constants/web3_constants'
import { formatMints } from '../../utils/formatters'

export const getMints = async (chainId: CHAINS, exchange: EXCHANGES, limit: number = 15) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]
  const chain = getChainConfiguration(chainId)

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const mintsData = await getOrSetCache(`mints?chainId=${chainId}&exchange=${exchange}&limit=${limit}`, async () => {
    const { mints, bundle } = await subgraphHelper.getDataByQuery({
      client: subgraph.CLIENT,
      query: subgraph.QUERIES.MINTS,
      variables: { first: limit },
    })
    return { mints, bundle }
  })

  const mints = await formatMints({ mints: mintsData, chain, exchange })

  return mints
}

export const getTokenMints = async (
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

  const contract = web3Helper.getContract(UNISWAP_FACTORY_ABI as AbiItem[], exchangeDetails.address, chain.web3)
  const pair = await web3Helper.getPairAddress(address, chain.tokens.NATIVE, contract)

  const mintsData = await getOrSetCache(
    `mints?address=${address}&chainId=${chainId}&exchange=${exchangeDetails.name}&limit=${limit}`,
    async () => {
      const { mints, bundle } = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKEN_MINTS,
        variables: { first: limit, pairs: [pair.toLowerCase()] },
      })
      return { mints, bundle }
    },
  )

  const mints = await formatMints({ mints: mintsData, chain, exchange: exchangeDetails.name })

  return mints
}

export default {
  getMints,
  getTokenMints,
}
