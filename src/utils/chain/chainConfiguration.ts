import Web3 from 'web3'
import { CHAINS } from '../../constants/constants'
import {
  BASE_TOKENS,
  DEFAULT_BLOCK_TIMES,
  FACTORIES,
  NETWORKS,
  RPC_URL,
  WEB3_CLIENTS,
} from '../../constants/web3_constants'

export type ChainId = 1088 | 1 //TODO: add network

export interface IFactoryConfiguration {
  name: string
  address: string
}

export interface ITokenConfiguration {
  NATIVE: string
  STABLE: string
  STABLE_SECONDARY: string
  FALLBACK: string
}

export interface IChainConfiguration {
  rpcEndpoint: string
  network: string
  chainId: CHAINS
  web3: Web3
  defaultBlocks: number
  factories: IFactoryConfiguration[]
  tokens: ITokenConfiguration
}

export const getChainConfiguration = (chainId: CHAINS): IChainConfiguration => {
  return {
    rpcEndpoint: RPC_URL[chainId],
    network: NETWORKS[chainId],
    chainId,
    web3: WEB3_CLIENTS[chainId],
    factories: FACTORIES[chainId],
    defaultBlocks: DEFAULT_BLOCK_TIMES[chainId],
    tokens: BASE_TOKENS[chainId],
  }
}
