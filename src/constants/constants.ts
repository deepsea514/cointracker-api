
import { HERCULES_V2_CONFIG } from './exchanges/metis/hercules-v2'
import { HERCULES_V3_CONFIG } from './exchanges/metis/hercules-v3'
import { UNISWAP_V2_CONFIG } from './exchanges/eth/uniswap-v2'
import { UNISWAP_V3_CONFIG } from './exchanges/eth/uniswap-v3'

// Subgraph constants

export enum EXCHANGES {
  HERCULES_V2 = 'Hercules-V2',
  HERCULES_V3 = 'Hercules-V3',
  UNISWAP_V2 = 'Uniswap-V2',
  UNISWAP_V3 = 'Uniswap-V3'
}

export enum CHAINS {
  ETH = 1,
  METIS = 1088,
}

export const SUBGRAPHS: any = {
  [`${CHAINS.ETH}`]: {
    [`${EXCHANGES.UNISWAP_V2}`]: UNISWAP_V2_CONFIG,
    [`${EXCHANGES.UNISWAP_V3}`]: UNISWAP_V3_CONFIG,
  },
  [`${CHAINS.METIS}`]: {
    [`${EXCHANGES.HERCULES_V2}`]: HERCULES_V2_CONFIG,
    [`${EXCHANGES.HERCULES_V3}`]: HERCULES_V3_CONFIG,
  },
}

export const API = {
  KEYS: ['267a377c237f41309b9f88420898723f'],
  SECRETS: ['f2df738c45624a029bf7405939f18217'],
}
