import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { CHAINS } from './constants'

type IChainDetails<T> = {
  [key in CHAINS]: T
}
// Old constants
export const TOKENS = {
  ZERO: '0x0000000000000000000000000000000000000000',
}

// Chain-dynamic constants
export const NETWORKS: IChainDetails<string> = {
  // [CHAINS.FTM]: 'ftm',
  [CHAINS.PLS]: 'pls',
  [CHAINS.MNT]: 'mnt',
  // [CHAINS.BSC]: 'bsc',
  // [CHAINS.ETH]: 'eth',
  // [CHAINS.MATIC]: 'matic',
  // [CHAINS.XDAI]: 'xdai',
}
// Chain-dynamic constants
export const NETWORK_NAMES: IChainDetails<string> = {
  // [CHAINS.FTM]: 'Fantom Opera',
  [CHAINS.PLS]: 'Pulse Chain',
  [CHAINS.MNT]: 'Mantle Network',
  // [CHAINS.BSC]: 'Binance Smart Chain',
  // [CHAINS.ETH]: 'Ethereum',
  // [CHAINS.MATIC]: 'Polygon',
  // [CHAINS.XDAI]: 'xDai',
}

export const DEFAULT_BLOCK_TIMES: IChainDetails<number> = {
  // [CHAINS.FTM]: 600, // 600 blocks is ~10 minutes ( 1 second blocks )
  [CHAINS.PLS]: 200, // 200 blocks is ~10 minutes ( 3 second blocks )
  [CHAINS.MNT]: 200, // 200 blocks is ~10 minutes ( 3 second blocks
  // [CHAINS.BSC]: 200, // 200 blocks is ~10 minutes ( 3 second blocks )
  // [CHAINS.ETH]: 46, // 46 blocks is ~10 minutes ( 13 second blocks )
  // [CHAINS.MATIC]: 46,
  // [CHAINS.XDAI]: 46,
}

export const RPC_URL: IChainDetails<string> = {
  // [CHAINS.FTM]: process.env.FTM_URL ?? 'https://rpc.ftm.tools/0be7111f-17ed-4498-b6f9-7afdd22a3488?cache=900',
  [CHAINS.PLS]: process.env.PLS_URL ?? 'https://rpc.pulsechain.com/',
  [CHAINS.MNT]: process.env.MNT_URL ?? 'https://rpc.mantle.xyz/',
  // [CHAINS.BSC]: process.env.BSC_URL ?? 'https://bsc-dataseed.binance.org/',
  // [CHAINS.ETH]: process.env.ETH_URL ?? 'https://mainnet.infura.io/v3/',
  // [CHAINS.MATIC]: process.env.MATIC_URL ?? 'https://rpc-mainnet.matic.network',
  // [CHAINS.XDAI]: process.env.XDAI_URL ?? 'https://rpc.xdaichain.com/',
}

export const WEB3_CLIENTS: IChainDetails<Web3> = {
  // [CHAINS.FTM]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.FTM])),
  [CHAINS.PLS]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.PLS])),
  [CHAINS.MNT]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.MNT])),
  // [CHAINS.BSC]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.BSC])),
  // [CHAINS.ETH]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.ETH])),
  // [CHAINS.MATIC]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.MATIC])),
  // [CHAINS.XDAI]: new Web3(new Web3.providers.HttpProvider(RPC_URL[CHAINS.XDAI])),
}

interface DEFAULT_CHAIN_TOKENS {
  NATIVE: string
  STABLE: string
  FALLBACK: string
}
export const BASE_TOKENS: IChainDetails<DEFAULT_CHAIN_TOKENS> = {
  // [CHAINS.FTM]: {
  //   NATIVE: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // wftm
  //   STABLE: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // usdc
  //   FALLBACK: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B', // spirit
  // },
  [CHAINS.PLS]: {
    NATIVE: '0xa1077a294dde1b09bb078844df40758a5d0f9a27', // wpls
    STABLE: '0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07', // usdc
    FALLBACK: '0x95b303987a60c71504d99aa1b13b4da07b0790ab', // plsx
  },
  [CHAINS.MNT]: {
    NATIVE: '0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8', // wmnt
    STABLE: '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9', // usdc
    FALLBACK: '0x554388ec984278a3c5bff09e6192c20cdfca9f29', // uahm
  },
  // [CHAINS.BSC]: {
  //   NATIVE: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // bnb
  //   STABLE: '0xe9e7cea3dedca5984780bafc599bd69add087d56', // busd
  //   FALLBACK: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // cake
  // },
  // [CHAINS.ETH]: {
  //   NATIVE: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  //   STABLE: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdc
  //   FALLBACK: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  // },
  // [CHAINS.MATIC]: {
  //   NATIVE: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  //   STABLE: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdt
  //   FALLBACK: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  // },
  // [CHAINS.XDAI]: {
  //   NATIVE: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  //   STABLE: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', // usdc
  //   FALLBACK: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
  // },
}

interface FACTORY_DEFINITION {
  address: string
  name: string
}

export const FACTORIES: IChainDetails<FACTORY_DEFINITION[]> = {
  // [CHAINS.FTM]: [
  //   {
  //     address: '0xef45d134b73241eda7703fa787148d9c9f4950b0',
  //     name: 'spirit',
  //   },
  //   {
  //     address: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
  //     name: 'spooky',
  //   },
  //   {
  //     address: '0x6178C3B21F7cA1adD84c16AD35452c85a85F5df4',
  //     name: 'zoo',
  //   },
  //   {
  //     address: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  //     name: 'sushi',
  //   },
  //   {
  //     address: '0x733A9D1585f2d14c77b49d39BC7d7dd14CdA4aa5',
  //     name: 'paint',
  //   },
  //   {
  //     address: '0xeAcC845E4db0aB59A326513347a37ed4E999aBD8',
  //     name: 'shiba',
  //   },
  // ],
  // [CHAINS.BSC]: [
  //   {
  //     address: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  //     name: 'pancake',
  //   },
  // ],
  // [CHAINS.ETH]: [
  //   {
  //     address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // uniswap v2
  //     name: 'uni',
  //   },
  //   {
  //     address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', // sushiswap v2
  //     name: 'sushi',
  //   },
  // ],
  // [CHAINS.MATIC]: [
  //   {
  //     address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
  //     name: 'sushi',
  //   },
  // ],
  // [CHAINS.XDAI]: [
  //   {
  //     address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
  //     name: 'sushi',
  //   },
  // ],
  [CHAINS.PLS]: [
    {
      address: '0x1715a3E4A142d8b698131108995174F37aEBA10D', // pulsex V1
      name: 'Diablo-PLSXV1',
    },
    {
      address: '0x29eA7545DEf87022BAdc76323F373EA1e707C523', // pulsex V2
      name: 'Diablo-PLSXV2',
    },
  ],
  [CHAINS.MNT]: [
    {
      address: '0xE5020961fA51ffd3662CDf307dEf18F9a87Cce7c', // fusion v2
      name: 'fusionx',
    },
  ],
}

export const EVENT_TYPES = { SWAP: 'Swap', MINT: 'Mint', BURN: 'Burn' }

export const UNISWAP_FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'PairCreated',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allPairs',
    outputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'allPairsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
    ],
    name: 'createPair',
    outputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'feeTo',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'feeToSetter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
    ],
    name: 'getPair',
    outputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'setFeeTo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'setFeeToSetter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const UNISWAP_PAIR_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'burn',
    outputs: [
      { internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_token0', type: 'address' },
      { internalType: 'address', name: '_token1', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const ERC20_ABI: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
]

export default {
  UNISWAP_FACTORY_ABI,
  UNISWAP_PAIR_ABI,
  ERC20_ABI,
  RPC_URL,
  BASE_TOKENS,
  FACTORIES,
  EVENT_TYPES,
}
