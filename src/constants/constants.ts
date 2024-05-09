
import { HERCULES_DEX_V2_CONFIG } from './exchanges/metis/hercules-v2'
import { HERCULES_DEX_V3_CONFIG } from './exchanges/metis/hercules-v3'

// Subgraph constants

export enum EXCHANGES {
  HERCULES_DEX_V2 = 'Hercules-V2',
  HERCULES_DEX_V3 = 'Hercules-V3',
}

export enum CHAINS {
  METIS = 1088,
}

export const SUBGRAPHS: any = {
  [`${CHAINS.METIS}`]: {
    [`${EXCHANGES.HERCULES_DEX_V2}`]: HERCULES_DEX_V2_CONFIG,
    [`${EXCHANGES.HERCULES_DEX_V3}`]: HERCULES_DEX_V3_CONFIG,
  },
}

export const API = {
  KEYS: ['267a377c237f41309b9f88420898723f'],
  SECRETS: ['f2df738c45624a029bf7405939f18217'],
}
