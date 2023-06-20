import { AbiItem } from 'web3-utils'
import Web3 from 'web3'
import web3Helper from '../../utils/web3/helpers'
import { IHistory, IToken } from '../../utils/web3/history'
import { getChainConfiguration, IChainConfiguration } from '../../utils/chain/chainConfiguration'
import { ERC20_ABI } from '../../constants/web3_constants'
import { CHAINS } from '../../constants/constants'
import { findMostLiquidExchange } from '../../utils/web3/cacheHelpers'
import { BadRequestError } from '../../utils/CustomErrors'

const getPricing = async (
  factoryAbi: AbiItem[],
  pairAbi: AbiItem[],
  erc20Abi: AbiItem[],
  addresses: string[],
  chainId: CHAINS,
) => {
  const chain = getChainConfiguration(chainId as CHAINS)

  if (!chain.network || !chainId) throw new BadRequestError('Invalid configuration error.')
  if (!addresses?.length) return []

  const mostLiquidNativeExchange = await findMostLiquidExchange(chain.tokens.NATIVE, chain.chainId)

  // get all the required base token-token data
  const { prices: basePrices, tokens: baseTokens } = await web3Helper.getPairDetails(
    factoryAbi,
    pairAbi,
    erc20Abi,
    [chain.tokens.NATIVE, chain.tokens.STABLE],
    chain,
    mostLiquidNativeExchange.address,
  )

  // Get the price of the chains native token in terms of its base stable token
  const token0IsNative = web3Helper.compareAddress(baseTokens.token0.options.address, chain.tokens.NATIVE, chain.web3)
  const nativePrice = token0IsNative ? basePrices.token0 : basePrices.token1

  return Promise.all(
    addresses.map(async (address) => {
      const mostLiquidExchange = await findMostLiquidExchange(address, chain.chainId)
      if (web3Helper.compareAddress(address, chain.tokens.NATIVE, chain.web3)) return { address, price: nativePrice }
      if (web3Helper.compareAddress(address, chain.tokens.STABLE, chain.web3)) return { address, price: 1 }

      const { prices, tokens } = await web3Helper.getPairDetails(
        factoryAbi,
        pairAbi,
        erc20Abi,
        [address, chain.tokens.NATIVE],
        chain,
        mostLiquidExchange.address,
      )

      const tokenPrice = web3Helper.compareAddress(tokens.token0.options.address, chain.tokens.NATIVE, chain.web3)
        ? prices.token1
        : prices.token0

      return {
        address,
        price: tokenPrice * nativePrice,
      }
    }),
  )
}

// TODO: This function has become mammoth, gotta break it down to smaller functions
const getHistoricalPricing = async (
  factoryAbi: AbiItem[],
  pairAbi: AbiItem[],
  erc20Abi: AbiItem[],
  type: string,
  tokenAddress: string,
  from: number,
  to: number,
  chain: IChainConfiguration,
) => {
  const currentBlock = await web3Helper.getCurrentBlock(chain.web3)
  let fromBlock = from ? from : currentBlock - chain.defaultBlocks
  let toBlock = to ? to : currentBlock

  if (!tokenAddress) {
    tokenAddress = chain.tokens.FALLBACK
  }

  const token = await getTokenDetails(tokenAddress, chain.web3)
  const mostLiquidExchange = await findMostLiquidExchange(tokenAddress, chain.chainId)

  const factoryContract = web3Helper.getContract(factoryAbi, mostLiquidExchange.address, chain.web3)

  // USDC-WFTM base pricing
  const basePairAddress = await web3Helper.getPairAddress(chain.tokens.NATIVE, chain.tokens.STABLE, factoryContract)

  const baseContract = web3Helper.getContract(pairAbi, basePairAddress, chain.web3)

  const [baseReserves, basePastSwaps, baseTokens] = await Promise.all([
    web3Helper.getReserves(baseContract),
    web3Helper.getPastEvents(baseContract, type, fromBlock, toBlock),
    web3Helper.getPairTokens(baseContract, chain.web3, erc20Abi),
  ])

  const baseHistory = await web3Helper.getBaseHistory(
    baseReserves,
    basePastSwaps,
    baseTokens,
    toBlock,
    chain.web3,
    chain.tokens.NATIVE,
  )

  if (web3Helper.compareAddress(tokenAddress, chain.tokens.STABLE, chain.web3)) {
    return getBaseStableCoinHistoricalPricing(baseHistory, token, chain.web3)
  }

  if (web3Helper.compareAddress(tokenAddress, chain.tokens.NATIVE, chain.web3)) {
    return getBaseNativeCoinHistoricalPricing(baseHistory, token, chain.web3)
  }

  const pairAddress = await web3Helper.getPairAddress(tokenAddress, chain.tokens.NATIVE, factoryContract)

  const pairContract = web3Helper.getContract(pairAbi, pairAddress, chain.web3)

  const [reserves, pastSwaps, tokens] = await Promise.all([
    web3Helper.getReserves(pairContract),
    web3Helper.getPastEvents(pairContract, type, fromBlock, toBlock),
    web3Helper.getPairTokens(pairContract, chain.web3, erc20Abi),
  ])

  const history = await web3Helper.getHistory(
    reserves,
    pastSwaps,
    tokens,
    toBlock,
    baseHistory,
    chain.web3,
    chain.tokens.NATIVE,
  )

  const prices = await web3Helper.getFormattedHistory(history, chain.web3)

  return { token, prices }
}

export const getTokenDetails = async (address: string, web3: Web3): Promise<IToken> => {
  const contract = web3Helper.getContract(ERC20_ABI, address, web3)

  const [name, symbol, decimals, totalSupply] = await web3Helper.executeBatchRequest(
    web3,
    contract.methods.name().call.request(),
    contract.methods.symbol().call.request(),
    contract.methods.decimals().call.request(),
    contract.methods.totalSupply().call.request(),
  )

  return {
    address,
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: Number(totalSupply) / 10 ** Number(decimals),
  }
}

const getBaseStableCoinHistoricalPricing = async (history: IHistory, token: IToken, web3: Web3) => {
  const usdcHistory = {
    blocks: history.blocks.map((b) => ((b.priceUSD = 1), b)),
    counter: history.counter,
  }
  return {
    token,
    prices: await web3Helper.getFormattedHistory(usdcHistory, web3),
  }
}

const getBaseNativeCoinHistoricalPricing = async (history: IHistory, token: IToken, web3: Web3) => {
  return {
    token,
    prices: await web3Helper.getFormattedHistory(history, web3),
  }
}

export default {
  getPricing,
  getHistoricalPricing,
  getTokenDetails,
}
