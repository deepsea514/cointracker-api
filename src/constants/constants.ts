import { PANCAKE_SWAP_CONFIG } from './exchanges/bsc/pancakeswap'
import { SUSHI_SWAP_ETH_CONFIG } from './exchanges/eth/sushiswap'
import { UNISWAP_CONFIG } from './exchanges/eth/uniswap'
import { PAINT_SWAP_CONFIG } from './exchanges/ftm/paintswap'
import { SHIBA_SWAP_CONFIG } from './exchanges/ftm/shibaswap'
import { SPIRIT_SWAP_CONFIG } from './exchanges/ftm/spiritswap'
import { SPOOKY_SWAP_CONFIG } from './exchanges/ftm/spookyswap'
import { SUSHI_SWAP_CONFIG } from './exchanges/ftm/sushiswap'
import { ZOO_DEX_CONFIG } from './exchanges/ftm/zoodex'

// Subgraph constants

export enum EXCHANGES {
  UNI_SWAP = 'uni', // ETH
  PANCAKE_SWAP = 'pancake', // BSC
  SUSHI_SWAP = 'sushi', // FTM  (also ETH, BSC)
  SPOOKY_SWAP = 'spooky', // FTM
  SPIRIT_SWAP = 'spirit', // FTM
  PAINT_SWAP = 'paint', // FTM
  ZOO_DEX = 'zoo', // FTM
  SHIBA_SWAP = 'shiba', // FTM
}

export enum CHAINS {
  ETH = 1,
  BSC = 56,
  FTM = 250,
  MATIC = 137,
  XDAI = 100,
}

export const SUBGRAPHS = {
  [`${CHAINS.ETH}`]: {
    [`${EXCHANGES.UNI_SWAP}`]: UNISWAP_CONFIG,
    [`${EXCHANGES.SUSHI_SWAP}`]: SUSHI_SWAP_ETH_CONFIG,
  },
  [`${CHAINS.BSC}`]: {
    [`${EXCHANGES.PANCAKE_SWAP}`]: PANCAKE_SWAP_CONFIG,
  },
  [`${CHAINS.FTM}`]: {
    [`${EXCHANGES.SPOOKY_SWAP}`]: SPOOKY_SWAP_CONFIG,
    [`${EXCHANGES.ZOO_DEX}`]: ZOO_DEX_CONFIG,
    [`${EXCHANGES.SUSHI_SWAP}`]: SUSHI_SWAP_CONFIG,
    [`${EXCHANGES.SPIRIT_SWAP}`]: SPIRIT_SWAP_CONFIG,
    [`${EXCHANGES.PAINT_SWAP}`]: PAINT_SWAP_CONFIG,
    [`${EXCHANGES.SHIBA_SWAP}`]: SHIBA_SWAP_CONFIG,
  },
}

export const API = {
  KEYS: ['casper-defi-master-key'],
  SECRETS: ['casper-defi-master-secret'],
}
