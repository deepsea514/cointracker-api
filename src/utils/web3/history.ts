import { Contract, EventData } from 'web3-eth-contract'
import Web3 from 'web3'
import { executeBatchRequest } from './batchOperations'
import { compareAddress } from './address'
import { getPricesFromReserves } from './prices'

export interface IHistory {
  blocks: {
    blockNumber: number
    priceETH: number | null
    priceUSD: number | null

    tokenName?: string
    tokenSymbol?: string
    liquidity?: number | null
  }[]
  counter: {
    reserves: any
  }
}

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: number
}
// TODO: This function is currently only working for Swap history
// TODO: Either modify this function to be generic, or create new functions for other events like Mint, Burn, etc.
export const getBaseHistory = async (
  reserves: any,
  events: EventData[],
  tokens: { token0: Contract; token1: Contract },
  startingBlock: number,
  web3: Web3,
  nativeAddress: string,
) => {
  const token0IsNative = compareAddress(tokens.token0.options.address, nativeAddress, web3)
  const nativeToken = token0IsNative ? tokens.token0 : tokens.token1
  const [decimal0, decimal1, name, symbol] = await executeBatchRequest(
    web3,
    tokens.token0.methods.decimals().call.request(),
    tokens.token1.methods.decimals().call.request(),
    nativeToken.methods.name().call.request(),
    nativeToken.methods.symbol().call.request(),
  ).then(([d0, d1, ...rest]) => [Number(d0), Number(d1), ...rest])

  const [token0Price, token1Price] = getPricesFromReserves(reserves, {
    token0: decimal0,
    token1: decimal1,
  })

  return events.reverse().reduce(
    (acc, cur) => {
      const { amount0In, amount0Out, amount1In, amount1Out } = cur.returnValues

      acc.counter.reserves._reserve0 += +amount0In
      acc.counter.reserves._reserve1 += +amount1In

      acc.counter.reserves._reserve0 -= +amount0Out
      acc.counter.reserves._reserve1 -= +amount1Out

      const [token0Amount, token1Amount] = getPricesFromReserves(acc.counter.reserves, {
        token0: decimal0,
        token1: decimal1,
      })

      const price = getPrice(token0Amount, token1Amount, token0IsNative)
      acc.blocks.push({
        blockNumber: cur.blockNumber,
        priceETH: 1, // 1 if eth means 'native token'
        priceUSD: price,
        tokenName: name,
        tokenSymbol: symbol,
      })

      return acc
    },
    {
      blocks: [
        {
          blockNumber: startingBlock,
          priceETH: 1,
          // USDC decimals = 6, WFTM Decimals = 18
          priceUSD: getPrice(token0Price, token1Price, token0IsNative),
          tokenName: name,
          tokenSymbol: symbol,
        },
      ],
      counter: {
        reserves: {
          _reserve0: Number(reserves._reserve0),
          _reserve1: Number(reserves._reserve1),
        },
      },
    },
  )
}

// TODO: This function is currently only working for swap history
// TODO: Either modify this function to be generic, or create new functions for other events like Mint, Burn, etc.
export const getHistory = async (
  reserves: any,
  events: EventData[],
  tokens: { token0: Contract; token1: Contract },
  startingBlock: number,
  historicPrices: IHistory,
  web3: Web3,
  nativeAddress: string,
) => {
  const { blocks } = historicPrices
  // determine which is wftm (we are assuming one is)
  const token0IsNative = compareAddress(tokens.token0.options.address, nativeAddress, web3)

  const activeToken = token0IsNative ? tokens.token1 : tokens.token0
  const [decimal0, decimal1, tokenName, tokenSymbol] = await executeBatchRequest(
    web3,
    tokens.token0.methods.decimals().call.request(),
    tokens.token1.methods.decimals().call.request(),

    activeToken.methods.name().call.request(),
    activeToken.methods.symbol().call.request(),
  ).then(([d0, d1, n, s]) => [Number(d0), Number(d1), n, s])

  // get the most recent block price to start
  let block = blocks.shift()

  const [token0Price, token1Price] = getPricesFromReserves(reserves, {
    token0: decimal0,
    token1: decimal1,
  })
  return events.reverse().reduce(
    (acc, cur) => {
      // make sure we still have blocks to process
      while (block && blocks.length && cur.blockNumber <= block.blockNumber) {
        // move to an earlier block when the current blocknumber is older than our base price block number
        block = blocks.shift()
      }

      const { amount0In, amount0Out, amount1In, amount1Out } = cur.returnValues

      acc.counter.reserves._reserve0 += Number(amount0In)
      acc.counter.reserves._reserve1 += Number(amount1In)

      acc.counter.reserves._reserve0 -= Number(amount0Out)
      acc.counter.reserves._reserve1 -= Number(amount1Out)

      const [token0Amount, token1Amount] = getPricesFromReserves(acc.counter.reserves, {
        token0: decimal0,
        token1: decimal1,
      })

      const priceETH = derivePrice(token0Amount, token1Amount, token0IsNative)
      const priceUSD = block?.priceUSD ? priceETH * block?.priceUSD : null
      acc.blocks.push({
        blockNumber: cur.blockNumber,
        priceETH,
        priceUSD,
        tokenName,
        tokenSymbol,
        liquidity: priceUSD
          ? (token0IsNative
              ? Number(acc.counter.reserves._reserve1) / 10 ** decimal1
              : Number(acc.counter.reserves._reserve0) / 10 ** decimal0) *
            priceUSD *
            2
          : null,
        // price: block?.price ? priceInFTM * block.price : null,
      })

      return acc
    },
    <IHistory>{
      // Starting point is current block, don't know the block number, and blocks on FTM are 0.7s, so afterwards, I'm just trimming it out 🤷
      blocks: [
        {
          blockNumber: startingBlock,
          priceETH: derivePrice(token0Price, token1Price, token0IsNative),
          priceUSD: block?.priceUSD ? derivePrice(token0Price, token1Price, token0IsNative) * block.priceUSD : null,
          tokenName,
          tokenSymbol,
          liquidity: block?.priceUSD
            ? (token0IsNative
                ? Number(reserves._reserve1) / 10 ** decimal1
                : Number(reserves._reserve0) / 10 ** decimal0) *
              derivePrice(token0Price, token1Price, token0IsNative) *
              block.priceUSD *
              2
            : null,
        },
      ],
      counter: {
        reserves: {
          _reserve0: Number(reserves._reserve0),
          _reserve1: Number(reserves._reserve1),
        },
      },
    },
  )
}

export const getFormattedHistory = async (history: IHistory, web3: Web3) => {
  return Promise.all(
      history.blocks.map(async (block) => {
        const timestamp = (await web3.eth.getBlock(block.blockNumber)).timestamp as number
        return {
            ...block,
            date: timestamp,
          }
      }),
  )
}

// TODO: If this function is returning the price in USD, it should be renamed to suggest as much

/**
 * Takes the prices of two tokens and returns the ??
 * @param token0Price The price of the first token
 * @param token1Price The price of the second token
 * @param token0IsNative Whether token0 is native or not
 * @returns The price
 */
const getPrice = (token0Price: number, token1Price: number, token0IsNative: boolean) => {
  return token0IsNative ? token1Price / token0Price : token0Price / token1Price
}

/**
 *
 * @param token0Price The price of token0
 * @param token1Price The price of token1
 * @param blockPrice The block price
 * @param token0IsNative Whether token0 is native or not
 * @returns The derived price
 */
const derivePrice = (token0Price: number, token1Price: number, token0IsNative: boolean) => {
  const priceInNative = token0IsNative ? token0Price / token1Price : token1Price / token0Price

  return priceInNative
}

export default {
  getHistory,
  getFormattedHistory,
  getBaseHistory,
}
