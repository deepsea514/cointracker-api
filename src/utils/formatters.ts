import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { AbiItem } from 'web3-utils'

import { CHAINS, EXCHANGES } from '../constants/constants'
import {
  ERC20_ABI,
  FACTORIES,
  UNISWAP_FACTORY_ABI,
  UNISWAP_FACTORY_ABI_V3,
  UNISWAP_PAIR_ABI,
  UNISWAP_PAIR_ABI_V3,
} from '../constants/web3_constants'
import { BadRequestError } from './CustomErrors'
import { IChainConfiguration } from './chain/chainConfiguration'
import { compareAddress } from './web3/address'
import web3Helper from './web3/helpers'
import { getPairDetails } from './web3/prices'

async function fetchNativePrice(chain: IChainConfiguration, exchangeName: string) {
  const isV3 = exchangeName.includes('V3')
  const factory = FACTORIES[chain.chainId as CHAINS].find((a: any) => a.name === exchangeName)
  if (!factory) {
    throw new BadRequestError('Invalid configuration error.')
  }

  const details = await getPairDetails(
    isV3 ? (UNISWAP_FACTORY_ABI_V3 as AbiItem[]) : (UNISWAP_FACTORY_ABI as AbiItem[]),
    isV3 ? (UNISWAP_PAIR_ABI_V3 as AbiItem[]) : (UNISWAP_PAIR_ABI as AbiItem[]),
    ERC20_ABI as AbiItem[],
    [chain.tokens.NATIVE, chain.tokens.STABLE],
    chain,
    factory.address,
    isV3,
  )

  const token0IsNative = compareAddress(details.tokens.token0.options.address, chain.tokens.NATIVE, chain.web3)

  return token0IsNative ? details.prices.token0 : details.prices.token1
}

export const formatBurns = async ({
  burns,
  chain,
  exchange,
}: {
  burns: any
  chain: IChainConfiguration
  exchange: EXCHANGES
}) => {
  const tokenIsNative = (token: string) => compareAddress(token, chain.tokens.NATIVE, chain.web3)
  let nativePrice = burns.bundle.chainPrice
  if (!nativePrice || nativePrice === '0') {
    nativePrice = await fetchNativePrice(chain, exchange)
  }

  for (let i = 0; i < burns.burns.length; i++) {
    const burn = burns.burns[i]
    const token0IsNative = tokenIsNative(burn.pair.token0.address)
    const token1IsNative = tokenIsNative(burn.pair.token1.address)

    if (!burn.pair.reserveUSD || Number(burn.pair.reserveUSD) === 0) {
      const backupReserveUSD = token0IsNative
        ? burn.pair.reserve1 * nativePrice * 2
        : burn.pair.reserve0 * nativePrice * 2
      burn.pair.reserveUSD = backupReserveUSD.toString()
    }

    burn.token0PriceUSD = (token0IsNative ? nativePrice : burn.pair.token1Price * nativePrice).toString()
    burn.token1PriceUSD = (token1IsNative ? nativePrice : burn.pair.token0Price * nativePrice).toString()

    burn.token0PriceETH = (burn.token0PriceUSD / nativePrice).toString()
    burn.token1PriceETH = (burn.token1PriceUSD / nativePrice).toString()

    if (!burn.amountUSD || Number(burn.amountUSD) === 0) {
      burn.amountUSD = ((token0IsNative ? burn.amount0 : burn.amount1) * nativePrice).toString()
    }
    const native = getNativeSymbol(chain.chainId)

    burns.burns[i] = {
      transactionAddress: burn.transaction.id,
      timestamp: burn.transaction.timestamp,
      blockNumber: burn.transaction.blockNumber,
      to: burn.to,
      sender: burn.sender,
      pairAddress: burn.pair.id,
      token0Address: burn.pair.token0.address,
      token1Address: burn.pair.token1.address,
      token0Symbol: burn.pair.token0.symbol,
      token1Symbol: burn.pair.token1.symbol,
      amount0: burn.amount0,
      amount1: burn.amount1,
      amountUSD: burn.amountUSD,
      [`amount${native}`]: (burn.amountUSD / nativePrice).toString(),
      pairLiquidityUSD: burn.pair.reserveUSD,
      [`pairLiquidity${native}`]: (burn.pair.reserveUSD / nativePrice).toString(),
      token0PriceUSD: burn.token0PriceUSD,
      [`token0Price${native}`]: burn.token0PriceETH,
      token1PriceUSD: burn.token1PriceUSD,
      [`token1Price${native}`]: burn.token1PriceETH,
      walletAddress: burn.sender,
      walletCategory: null,
      AMM: exchange, // TODO: look up proper name instead of short code (paint/spirit/sushi)
      network: chain.chainId, // TODO: get chain name instead of chain ID currently
    }
  }
  return burns.burns
}

export const formatMints = async ({
  mints,
  chain,
  exchange,
}: {
  mints: any
  chain: IChainConfiguration
  exchange: string
}) => {
  const tokenIsNative = (token: string) => compareAddress(token, chain.tokens.NATIVE, chain.web3)
  let nativePrice = mints.bundle.chainPrice
  if (!nativePrice || nativePrice === '0') {
    nativePrice = await fetchNativePrice(chain, exchange)
  }

  for (let i = 0; i < mints.mints.length; i++) {
    const mint = mints.mints[i]
    const token0IsNative = tokenIsNative(mint.pair.token0.address)
    const token1IsNative = tokenIsNative(mint.pair.token1.address)

    if (!mint.pair.reserveUSD || Number(mint.pair.reserveUSD) === 0) {
      const backupReserveUSD = token0IsNative
        ? mint.pair.reserve1 * nativePrice * 2
        : mint.pair.reserve0 * nativePrice * 2
      mint.pair.reserveUSD = backupReserveUSD.toString()
    }

    mint.token0PriceUSD = (token0IsNative ? nativePrice : mint.pair.token1Price * nativePrice).toString()
    mint.token1PriceUSD = (token1IsNative ? nativePrice : mint.pair.token0Price * nativePrice).toString()

    mint.token0PriceETH = (mint.token0PriceUSD / nativePrice).toString()
    mint.token1PriceETH = (mint.token1PriceUSD / nativePrice).toString()

    if (!mint.amountUSD || Number(mint.amountUSD) === 0) {
      mint.amountUSD = ((token0IsNative ? mint.amount0 : mint.amount1) * nativePrice).toString()
    }

    const native = getNativeSymbol(chain.chainId)
    // console.log(native, chain.chainId)

    mints.mints[i] = {
      transactionAddress: mint.transaction.id,
      timestamp: mint.transaction.timestamp,
      blockNumber: mint.transaction.blockNumber,
      to: mint.to,
      sender: mint.sender,
      pairAddress: mint.pair.id,
      token0Address: mint.pair.token0.address,
      token1Address: mint.pair.token1.address,
      token0Symbol: mint.pair.token0.symbol,
      token1Symbol: mint.pair.token1.symbol,
      amount0: mint.amount0,
      amount1: mint.amount1,
      amountUSD: mint.amountUSD,
      [`amount${native}`]: (mint.amountUSD / nativePrice).toString(),
      pairLiquidityUSD: mint.pair.reserveUSD,
      [`pairLiquidity${native}`]: (mint.pair.reserveUSD / nativePrice).toString(),
      token0PriceUSD: mint.token0PriceUSD,
      [`token0Price${native}`]: mint.token0PriceETH,
      token1PriceUSD: mint.token1PriceUSD,
      [`token1Price${native}`]: mint.token1PriceETH,
      walletAddress: mint.to,
      walletCategory: null,
      AMM: exchange, // TODO: look up proper name instead of short code (paint/spirit/sushi)
      network: chain.chainId, // TODO: get chain name instead of chain ID currently
    }
  }

  return mints.mints
}

export const formatSwaps = async ({
  swaps,
  chain,
  exchange,
}: {
  swaps: any
  chain: IChainConfiguration
  exchange: EXCHANGES
}) => {
  const isV3 = exchange.includes('V3')
  const tokenIsNative = (token: string) => compareAddress(token, chain.tokens.NATIVE, chain.web3)
  let nativePrice = swaps.bundle.chainPrice
  if (!nativePrice || nativePrice === '0') {
    nativePrice = await fetchNativePrice(chain, exchange)
  }

  for (let i = 0; i < swaps.swaps.length; i++) {
    const swap = swaps.swaps[i]
    const token0IsNative = tokenIsNative(swap.pair.token0.address)
    const token1IsNative = tokenIsNative(swap.pair.token1.address)

    if (!swap.pair.reserveUSD || Number(swap.pair.reserveUSD) === 0) {
      const backupReserveUSD = token0IsNative
        ? swap.pair.reserve1 * nativePrice * 2
        : swap.pair.reserve0 * nativePrice * 2

      swap.pair.reserveUSD = backupReserveUSD.toString()
    }

    swap.token0PriceUSD = (token0IsNative ? nativePrice : swap.pair.token1Price * nativePrice).toString()
    swap.token1PriceUSD = (token1IsNative ? nativePrice : swap.pair.token0Price * nativePrice).toString()

    swap.token0PriceETH = (swap.token0PriceUSD / nativePrice).toString()
    swap.token1PriceETH = (swap.token1PriceUSD / nativePrice).toString()

    if (!swap.amountUSD || Number(swap.amountUSD) === 0) {
      const amount0 = isV3 ? swap.amount0 : swap.amount0In + swap.amount0Out
      const amount1 = isV3 ? swap.amount1 : swap.amount1In + swap.amount1Out
      swap.amountUSD = ((token0IsNative ? amount0 : amount1) * nativePrice).toString()
    }
    // console.log(swaps[i])
    const native: string = getNativeSymbol(chain.chainId)
    // console.log(native, chain.chainId)

    swaps.swaps[i] = {
      transactionAddress: swap.transaction.id,
      timestamp: swap.transaction.timestamp,
      blockNumber: swap.transaction.blockNumber,
      to: swap.to,
      sender: swap.sender,
      pairAddress: swap.pair.id,
      amount0In: isV3 ? swap.amount0 : swap.amount0In,
      amount1In: isV3 ? swap.amount1 : swap.amount1In,
      amount0Out: isV3 ? swap.amount0 : swap.amount0Out,
      amount1Out: isV3 ? swap.amount1 : swap.amount1Out,
      amountUSD: swap.amountUSD,
      pairLiquidityUSD: swap.pair.reserveUSD,
      token0Address: swap.pair.token0.address,
      token1Address: swap.pair.token1.address,
      token0Symbol: swap.pair.token0.symbol,
      token1Symbol: swap.pair.token1.symbol,
      token0PriceUSD: swap.token0PriceUSD,
      token1PriceUSD: swap.token1PriceUSD,
      [`token0Price${native}`]: swap.token0PriceETH,
      [`token1Price${native}`]: swap.token1PriceETH,

      // TODO: do we actually want the prices in ETH here? I think probably we want the native token (FTM/ETH/BSC) if so,
      // should this still be called ETH for simplicity ?
      [`amount${native}`]: (swap.amountUSD / nativePrice).toString(),
      [`pairLiquidity${native}`]: (swap.pair.reserveUSD / nativePrice).toString(),
      walletAddress: swap.from ? swap.from : null, // TODO: This value is undefined for sushi. Not included in subgraph. Will need to fill in with web3, or deploy a new subgraph if we need this
      walletCategory: null,
      AMM: exchange, // TODO: look up proper name instead of short code (paint/spirit/sushi)
      network: chain.chainId, // TODO: get chain name instead of chain ID currently
    }
  }
  return swaps.swaps
}

// TODO: add network
const getNativeSymbol = (chainId: CHAINS) => {
  return chainId == CHAINS.METIS ? 'METIS' : 'ETH' //TODO: update if adding chains
}

const supabase = createClient(
  process.env.SUPABASE_URL ?? 'https://kyqhshdiyozjbozuqyye.supabase.co',
  process.env.SUPABASE_ANON_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cWhzaGRpeW96amJvenVxeXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTM2NDUsImV4cCI6MjAzMDIyOTY0NX0.BjPP4wABBv9cbL70tCcE2oc2OXkmqU2Y1n-cabSF5Dk',
)

export const formatToken = async ({
  token,
  bundle,
  pair,
  pairDayDatas,
  nativePairDayDatas,
  chain,
  exchange,
}: {
  token: any
  bundle: any
  pair: any
  pairDayDatas: any[]
  nativePairDayDatas: any[]
  chain: IChainConfiguration
  exchange: string
}) => {
  const { data, error } = await supabase
    .from('info')
    .select('bio, twitter, telegram, discord, website')
    .eq('token_address', token.address.toLowerCase())

  const isV3 = exchange.includes('V3')
  const tokenIsNative = (token: string) => compareAddress(token, chain.tokens.NATIVE, chain.web3)

  const token0IsNative = tokenIsNative(pair?.token0?.address)
  const token1IsNative = tokenIsNative(pair?.token1?.address)
  const nativeIsDesiredToken = tokenIsNative(token.address)

  const base0IsNative = tokenIsNative(
    isV3 ? nativePairDayDatas[0]?.pool?.token0?.address : nativePairDayDatas[0]?.token0?.address,
  )
  const returnNullIfZero = (val: any) => (['', '0'].includes(val) ? null : val)
  const nativePrice = returnNullIfZero(bundle.chainPrice) ?? (await fetchNativePrice(chain, exchange))

  function getTokenRelativePrice(wantsToken0: boolean, reserve0: number | null = null, reserve1: number | null = null) {
    if (!reserve0 || !reserve1) {
      return 0
    }

    if (wantsToken0) {
      return reserve1 / reserve0
    }

    return reserve0 / reserve1
  }

  const priceUSD = nativeIsDesiredToken
    ? nativePrice
    : token0IsNative
    ? pair?.token0Price * nativePrice ?? null
    : pair?.token1Price * nativePrice ?? null

  const priceETH = priceUSD / nativePrice
  const volume24h = token.dayData[0]?.volume ?? null
  const volume24hHistoric = token.dayData[1]?.volume ?? null
  const txCount = token.dayData[0]?.txCount ?? null
  const txCountHistoric = token.dayData[1]?.txCount ?? null
  const liquidity = token.dayData[0]?.liquidity ?? null
  const liquidityHistoric = token.dayData[1]?.liquidity ?? null

  const currentNativePrice = isV3
    ? base0IsNative
      ? nativePairDayDatas[0]?.token0Price
      : nativePairDayDatas[0]?.token1Price
    : getTokenRelativePrice(base0IsNative, nativePairDayDatas[0]?.reserve0, nativePairDayDatas[0]?.reserve1)
  const historicNativePrice = isV3
    ? base0IsNative
      ? nativePairDayDatas[1]?.token0Price
      : nativePairDayDatas[1]?.token1Price
    : getTokenRelativePrice(base0IsNative, nativePairDayDatas[1]?.reserve0, nativePairDayDatas[1]?.reserve1)

  // Current & Historic token Price in FTM
  const currentTokenPrice = nativeIsDesiredToken
    ? currentNativePrice
    : isV3
    ? base0IsNative
      ? pairDayDatas[0]?.token0Price
      : pairDayDatas[0]?.token1Price
    : getTokenRelativePrice(token0IsNative, pairDayDatas[0]?.reserve0, pairDayDatas[0]?.reserve1)

  const historicTokenPrice = nativeIsDesiredToken
    ? historicNativePrice
    : isV3
    ? base0IsNative
      ? pairDayDatas[1]?.token0Price
      : pairDayDatas[1]?.token1Price
    : getTokenRelativePrice(token0IsNative, pairDayDatas[1]?.reserve0, pairDayDatas[1]?.reserve1)

  const currentPriceUSD = nativeIsDesiredToken ? currentNativePrice : currentTokenPrice / currentNativePrice
  const historicPriceUSD = nativeIsDesiredToken ? historicNativePrice : historicTokenPrice / historicNativePrice

  const priceChange24h =
    currentTokenPrice && historicTokenPrice ? (currentTokenPrice / historicTokenPrice - 1).toString() : '0'
  const priceUSDChange24h =
    currentPriceUSD && historicPriceUSD ? (currentPriceUSD / historicPriceUSD - 1).toString() : '0'
  const priceETHChange24h =
    currentTokenPrice && historicTokenPrice ? (currentTokenPrice / historicTokenPrice - 1).toString() : '0'

  const totalSupply = (await web3Helper.getTotalSupply(token.address, chain.web3)) / 10 ** Number(token.decimals)

  const native = getNativeSymbol(chain.chainId)
  // console.log(native, chain.chainId)

  const finalSevenDayData = token?.sevenDayData?.map((data: any) => {
    let priceNative = nativeIsDesiredToken
      ? 1
      : parseFloat(data.priceUSD) * (parseFloat(data[`liquidity${native}`]) / parseFloat(data.liquidityUSD))
    if (isNaN(priceNative)) priceNative = 0
    return {
      ...data,
      [`price${native}`]: `${priceNative ?? 0}`,
    }
  })

  const tokenSecurity = await getTokenSecurity(chain.chainId, token.address)

  return {
    address: token?.address ?? null,
    symbol: token?.symbol ?? null,
    name: token?.name ?? null,
    decimals: token.decimals,
    totalSupply: totalSupply.toString(),
    marketCapUSD: priceUSD ? (totalSupply * priceUSD).toString() : null,
    [`marketCap${native}`]: priceETH ? (totalSupply * priceETH).toString() : null,
    volume24h: volume24h ?? null,
    volume24hUSD: volume24h ? (volume24h * priceUSD).toString() : null,
    [`volume24h${native}`]: volume24h ? (volume24h * priceETH).toString() : null,
    volumeChange24h: volume24h && volume24hHistoric ? (volume24h / volume24hHistoric - 1).toString() : null,
    transactions24h: txCount ? txCount : null,
    transactions24hChange: txCount && txCountHistoric ? (txCount / txCountHistoric - 1).toString() : null,
    //   verified, // TODO: we need to get a list of verified tokens from each exchange
    liquidityUSD: liquidity ? (liquidity * priceUSD).toString() : null,
    [`liquidity${native}`]: liquidity ? (liquidity * priceETH).toString() : null,
    liquidityChange24h: liquidity && liquidityHistoric ? (liquidity / liquidityHistoric - 1).toString() : null,
    logoURI: `https://kyqhshdiyozjbozuqyye.supabase.co/storage/v1/object/public/token-icons/${token?.address}.png`, // TODO: we need images still, maybe we can get the from FTMscan or covalent
    priceUSD: priceUSD.toString() ?? null,
    [`price${native}`]: priceETH.toString() ?? null,
    priceChange24h,
    priceUSDChange24h,
    [`price${native}Change24h`]: priceETHChange24h,
    AMM: exchange,
    network: chain.chainId,
    sevenDayData: finalSevenDayData,
    bio: (data && data[0]?.bio) ?? null,
    twitter: (data && data[0]?.twitter) ?? null,
    telegram: (data && data[0]?.telegram) ?? null,
    discord: (data && data[0]?.discord) ?? null,
    website: (data && data[0]?.website) ?? null,
    heliosprotect: tokenSecurity ?? null,
  }
}

const getTokenSecurity = async (chainId: CHAINS, address: string) => {
  try {
    const { data } = await axios.get(
      `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`,
    )

    if (data.code === 1) {
      return data.result[address]
    }

    return null
  } catch (error) {
    return null
  }
}
