import { AbiItem } from 'web3-utils'
import { IChainConfiguration } from '../chain/chainConfiguration'
import { getPairAddress } from './address'
import { executeBatchRequest } from './batchOperations'
import { getContract } from './contracts'
import { getReserves } from './reserves'
import { getPairTokens } from './tokens'

// This function seems redundant?
// export const getDetailedPrices = (address: string, web3: Web3) => {
//   return address;
// };

export const getRelativePrice = (reserves: any, decimals: { token0: number; token1: number }) => {
  const [token0Price, token1Price] = getPricesFromReserves(reserves, decimals)

  return {
    token0: token1Price / token0Price,
    token1: token0Price / token1Price,
  }
}

export const getPairDetails = async (
  factoryAbi: AbiItem[],
  pairAbi: AbiItem[],
  erc20Abi: AbiItem[],
  tokenAddresses: [string, string],
  chain: IChainConfiguration,
  factoryAddress: string,
) => {
  const factoryContract = await getContract(factoryAbi, factoryAddress, chain.web3)

  const pairAddress = await getPairAddress(tokenAddresses[0], tokenAddresses[1], factoryContract)

  const pairContract = getContract(pairAbi, pairAddress, chain.web3)

  const [reserves, tokens] = await Promise.all([
    getReserves(pairContract),
    getPairTokens(pairContract, chain.web3, erc20Abi),
  ])

  const decimals = await executeBatchRequest(
    chain.web3,
    tokens.token0.methods.decimals().call.request(),
    tokens.token1.methods.decimals().call.request(),
  ).then(([d0, d1]) => ({ token0: Number(d0), token1: Number(d1) }))

  return {
    factoryContract,
    pairContract,
    tokens,
    reserves,
    prices: getRelativePrice(reserves, decimals),
  }
}

/**
 * Takes the reserves and returns prices for both tokens.
 * @param reserves The reserves object `{ reserve0: number, reserve1: number }`
 * @param decimals The decimals object `{ token0: number, token1: number}`
 * @returns an array of prices `[ token0Price: number, token1Price: number ]`
 */
export const getPricesFromReserves = (reserves: any, decimals: { token0: number; token1: number }) => {
  return [reserves._reserve0 / 10 ** decimals.token0, reserves._reserve1 / 10 ** decimals.token1]
}

export default {
  //   getDetailedPrices,
  getRelativePrice,
  getPairDetails,
  getPricesFromReserves,
}
