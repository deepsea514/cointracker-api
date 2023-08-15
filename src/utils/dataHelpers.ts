import { CHAINS } from '../constants/constants'
import { FACTORIES } from '../constants/web3_constants'
import { BadRequestError } from './CustomErrors'

export function getExchangeDetailsByName(exchange: string, chainId: CHAINS) {
  return FACTORIES[chainId]?.find((f: any) => f.name.toLowerCase() === exchange.toLowerCase())
}
