// import { PANCAKE_SWAP_CONFIG } from './exchanges/bsc/pancakeswap'
// import { SUSHI_SWAP_ETH_CONFIG } from './exchanges/eth/sushiswap'
// import { UNISWAP_CONFIG } from './exchanges/eth/uniswap'
// import { PAINT_SWAP_CONFIG } from './exchanges/ftm/paintswap'
// import { SHIBA_SWAP_CONFIG } from './exchanges/ftm/shibaswap'
// import { SPIRIT_SWAP_CONFIG } from './exchanges/ftm/spiritswap'
// import { SPOOKY_SWAP_CONFIG } from './exchanges/ftm/spookyswap'
// import { SUSHI_SWAP_CONFIG } from './exchanges/ftm/sushiswap'
// import { ZOO_DEX_CONFIG } from './exchanges/ftm/zoodex'
import { PULSEX_V1_CONFIG } from './exchanges/pls/pulsexV1'
import { PULSEX_V2_CONFIG } from './exchanges/pls/pulsexV2'
import { FUSIONX_V2_CONFIG } from './exchanges/mnt/fusionxV2'
import { FUSIONX_V3_CONFIG } from './exchanges/mnt/fusionxV3'
import { ROCKET_SWAP_CONFIG } from './exchanges/base/rocketswap'

// Subgraph constants

export enum EXCHANGES {
  // UNI_SWAP = 'uni', // ETH
  // PANCAKE_SWAP = 'pancake', // BSC
  // SUSHI_SWAP = 'sushi', // FTM  (also ETH, BSC)
  // SPOOKY_SWAP = 'spooky', // FTM
  // SPIRIT_SWAP = 'spirit', // FTM
  // PAINT_SWAP = 'paint', // FTM
  // ZOO_DEX = 'zoo', // FTM
  // SHIBA_SWAP = 'shiba', // FTM
  PULSEX_V1 = 'pulsexV1', // PLS V1
  PULSEX_V2 = 'pulsexV2', // PLS V2
  FUSIONX_V2 = 'fusionxV2', // MNT
  FUSIONX_V3 = 'fusionxV3', // MNT
  ROCKET_SWAP = 'rocketswap', // WETH
}

export enum CHAINS {
  // ETH = 1,
  // BSC = 56,
  // FTM = 250,
  // MATIC = 137,
  // XDAI = 100,
  PLS = 369,
  MNT = 5000,
  BASE = 8453,
}

export const SUBGRAPHS = {
  // [`${CHAINS.ETH}`]: {
  //   [`${EXCHANGES.UNI_SWAP}`]: UNISWAP_CONFIG,
  //   [`${EXCHANGES.SUSHI_SWAP}`]: SUSHI_SWAP_ETH_CONFIG,
  // },
  // [`${CHAINS.BSC}`]: {
  //   [`${EXCHANGES.PANCAKE_SWAP}`]: PANCAKE_SWAP_CONFIG,
  // },
  // [`${CHAINS.FTM}`]: {
  //   [`${EXCHANGES.SPOOKY_SWAP}`]: SPOOKY_SWAP_CONFIG,
  //   [`${EXCHANGES.ZOO_DEX}`]: ZOO_DEX_CONFIG,
  //   [`${EXCHANGES.SUSHI_SWAP}`]: SUSHI_SWAP_CONFIG,
  //   [`${EXCHANGES.SPIRIT_SWAP}`]: SPIRIT_SWAP_CONFIG,
  //   [`${EXCHANGES.PAINT_SWAP}`]: PAINT_SWAP_CONFIG,
  //   [`${EXCHANGES.SHIBA_SWAP}`]: SHIBA_SWAP_CONFIG,
  // },
  [`${CHAINS.PLS}`]: {
    [`${EXCHANGES.PULSEX_V1}`]: PULSEX_V1_CONFIG,
    [`${EXCHANGES.PULSEX_V2}`]: PULSEX_V2_CONFIG,
  },
  [`${CHAINS.MNT}`]: {
    [`${EXCHANGES.FUSIONX_V2}`]: FUSIONX_V2_CONFIG,
    [`${EXCHANGES.FUSIONX_V3}`]: FUSIONX_V3_CONFIG,
  },
  [`${CHAINS.BASE}`]: {
    [`${EXCHANGES.ROCKET_SWAP}`]: ROCKET_SWAP_CONFIG,
  },
}

export const API = {
  KEYS: ['267a377c237f41309b9f88420898723f'],
  SECRETS: ['f2df738c45624a029bf7405939f18217'],
}
