import { getOrSetCache } from '../../cache/redis'
import { CHAINS } from '../../constants/constants'
import web3Helper from './helpers'

export function findMostLiquidExchange(address: string, chainId: CHAINS) {
  return getOrSetCache(`pairs/exchanges?address=${address}&chainId=${chainId}`, () =>
    web3Helper.findMostLiquidExchange(address, chainId),
  )
}
