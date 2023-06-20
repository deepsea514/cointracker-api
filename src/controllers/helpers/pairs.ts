import { gql } from 'graphql-request'
import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import Pair, { IPair } from '../../models/pairSchema'
import { BadRequestError } from '../../utils/CustomErrors'
import subgraphHelper from '../../utils/subgraph/subgraph'
import { getExchange } from './tokens'

export const getPairsByTokenFromDB = async (address: string, chainId: CHAINS, exchange: EXCHANGES) => {
  return await Pair.find({
    $and: [{ $or: [{ token0Address: address }, { token1Address: address }] }, { network: chainId, AMM: exchange }],
  })
}

export const getPairsByTokenFromSubgraph = async (address: string, chainId: CHAINS, exchange: EXCHANGES) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  if (!subgraph) throw new BadRequestError('Invalid configuration. Please provide a valid chainID and exchange.')

  let data = await subgraphHelper.getDataByQuery({
    client: subgraph.CLIENT,
    query: subgraph.QUERIES.PAIRS,
    variables: { token: address } as object,
  })

  const allPairs = [...data.pair0, ...data.pair1]

  const existingPairs = await Pair.find({
    $and: [{ $or: [{ token0Address: address }, { token1Address: address }] }, { network: chainId, AMM: exchange }],
  })

  const existingPairAddresses = existingPairs.map((pair: IPair) => pair.pairAddress)

  const newPairs = allPairs.filter((pair: IPair) => !existingPairAddresses.includes(pair.pairAddress))
  console.log(`Found: ${allPairs.length}, in DB: ${existingPairs.length}, new: ${newPairs.length} for ${address}`)

  for (let i = 0; i < newPairs.length; i++) {
    const newPair: IPair = {
      id: `${newPairs[i].pairAddress}_${getExchange(exchange, chainId)}`,
      pairAddress: newPairs[i]?.pairAddress,
      token0Symbol: newPairs[i]?.token0?.symbol,
      token0Address: newPairs[i]?.token0?.address,
      token1Symbol: newPairs[i]?.token1?.symbol,
      token1Address: newPairs[i]?.token1?.address,
      createdAtBlock: newPairs[i]?.createdAtBlockNumber,
      createdAtTimestamp: `${parseInt(newPairs[i]?.createdAtTimestamp) * 1000}`,
      network: chainId,
      AMM: exchange,
    }
    await Pair.create(newPair)
    // console.log(pair)
  }
}

export default {
  getPairsByTokenFromDB,
  getPairsByTokenFromSubgraph,
}
