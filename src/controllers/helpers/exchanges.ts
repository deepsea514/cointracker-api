import subgraphHelper from '../../utils/subgraph/subgraph'
import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import Token from '../../models/tokenSchema'

export const getSupportedExchanges = async () => {
  let chains = await Token.find({}).distinct('network')
  let exchanges = await Token.find({}).distinct('AMM')

  let promises: Promise<any>[] = []

  chains.forEach((ch) => {
    exchanges.forEach((ex) => {
      const subgraph = SUBGRAPHS[`${ch}`]?.[`${ex}`]

      if (!subgraph) return
      promises.push(
        subgraphHelper.getDataByQuery({ client: subgraph.CLIENT, query: subgraph.QUERIES.FACTORY, variables: {} }),
      )
    })
  })

  return (await Promise.all(promises)).flat()
}

interface IExchange {
  [x: string]: {
    id: string
    totalLiquidityFTM: number
    totalLiquidityUSD: number
    totalPairs: number
    totalTransactions: number
    totalVolumeFTM: number
    totalVolumeUSD: number
  }
}

const formatSupportedExchanges = (exchanges: IExchange[]) => {}

export default {
  getSupportedExchanges,
}
