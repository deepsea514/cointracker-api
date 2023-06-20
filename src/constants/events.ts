import { AbiInput, AbiItem } from 'web3-utils'

// Pair events
export const Mint = `Mint(address,uint256,uint256)`
export const MintAbi = [
  { type: 'address', name: 'sender', indexed: true },
  { type: 'uint256', name: 'amount0' },
  { type: 'uint256', name: 'amount1' },
]

export const Burn = `Burn(address,uint256,uint256,address)`
export const BurnAbi = [
  { type: 'address', name: 'sender', indexed: true },
  { type: 'uint256', name: 'amount0' },
  { type: 'uint256', name: 'amount1' },
  { type: 'address', name: 'to', indexed: true },
]

export const Swap = `Swap(address,uint256,uint256,uint256,uint256,address)`
export const SwapAbi = [
  { type: 'string', name: 'sender', indexed: true },
  { type: 'uint256', name: 'amount0In' },
  { type: 'uint256', name: 'amount1In' },
  { type: 'uint256', name: 'amount0Out' },
  { type: 'uint256', name: 'amount1Out' },
  { type: 'string', name: 'to', indexed: true },
]

// Factory events
export const PairCreated = `PairCreated(address,address,address,uint256)`
export const PairCreateAbi: AbiInput[] = [
  { type: 'address', name: 'token0', indexed: true },
  { type: 'address', name: 'token1', indexed: true },
  { type: 'address', name: 'pair' },
  { type: 'uint256', name: 'count' },
]
