import { CHAINS } from '../../constants/constants'
import { NETWORKS, NETWORK_NAMES } from '../../constants/web3_constants'

export const getChains = async () => {
  return Object.entries(NETWORKS).map(([chainId, symbol]): { name: string; symbol: string; chainId: CHAINS } => {
    return {
      name: NETWORK_NAMES[Number(chainId) as CHAINS],
      symbol,
      chainId: Number(chainId),
    }
  })
}
