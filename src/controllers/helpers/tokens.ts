import { CHAINS, EXCHANGES, SUBGRAPHS } from '../../constants/constants'
import subgraphHelper from '../../utils/subgraph/subgraph'
import { BadRequestError, InsufficientDataError, ResourceNotFoundError } from '../../utils/CustomErrors'
import { getChainConfiguration, IChainConfiguration } from '../../utils/chain/chainConfiguration'
import { compareAddress } from '../../utils/web3/address'
import web3Helper from '../../utils/web3/helpers'
import { AbiItem } from 'web3-utils'
import {
  calculateReservesAndPrice,
  calculateTimeSlots,
  chunkIntervalSwapData,
  getCandlestickData,
  ICandleStickData,
  IRawPairData,
  // IRawSwapData,
  // IRawSwapDataV3,
} from '../../utils/candlestickCharts'
import { fetchTokenHistoricalDataBetweenTimeStamps } from '../../utils/subgraph/dataFetchHelper'
import { getOrSetCache } from '../../cache/redis'
import { findMostLiquidExchange } from '../../utils/web3/cacheHelpers'
import { getExchangeDetailsByName } from '../../utils/dataHelpers'
import Token from '../../models/tokenSchema'
import { UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ABI_V3 } from '../../constants/web3_constants'
import { formatToken } from '../../utils/formatters'
import { gql } from 'graphql-request'
import { getTokenById } from '../../utils/token'
import Pair from '../../models/pairSchema'
import History, { IHistory } from '../../models/historySchema'

export const getTokenByAddress = async (
  chainId: CHAINS,
  exchange: EXCHANGES,
  address: string,
  cache: boolean = true,
) => {
  const exchangeDetails = exchange
    ? getExchangeDetailsByName(exchange, chainId)
    : await findMostLiquidExchange(address, chainId)
  console.log('exchangeDetails---------------', exchangeDetails)
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchangeDetails.name}`]

  const chain = getChainConfiguration(chainId)
  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const isV3 = exchangeDetails.name.includes('V3')

  const contract = web3Helper.getContract(
    isV3 ? (UNISWAP_FACTORY_ABI_V3 as AbiItem[]) : (UNISWAP_FACTORY_ABI as AbiItem[]),
    exchangeDetails.address,
    chain.web3,
  )

  let pair: string = ''
  let tokenNativePair = await Pair.findOne({
    token0Address: address,
    token1Address: chain.tokens.NATIVE,
    network: chainId,
    AMM: exchange,
  })
  let stableNativePair = await Pair.findOne({
    token0Address: chain.tokens.STABLE,
    token1Address: chain.tokens.NATIVE,
    network: chainId,
    AMM: exchange,
  })

  pair = compareAddress(address, chain.tokens.NATIVE, chain.web3)
    ? stableNativePair?.pairAddress ??
      (await web3Helper.getPairAddress(chain.tokens.STABLE, chain.tokens.NATIVE, contract, isV3))
    : tokenNativePair?.pairAddress ?? (await web3Helper.getPairAddress(address, chain.tokens.NATIVE, contract, isV3))
  console.log('pair**************', pair)
  const tokenData = await getOrSetCache(
    `${chainId}/tokens?chainId=${chainId}&exchange=${exchange}&address=${address}`,
    async () => {
      const data = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKEN,
        variables: {
          address: address.toLowerCase(),
          pair: pair.toLowerCase(),
          baseTokens: [chain.tokens.NATIVE, chain.tokens.STABLE],
        },
      })

      return data
    },
    cache,
  )
  console.log("tokenData++++++++++++++++++", tokenData)

  if (!tokenData.token)
    throw new ResourceNotFoundError(`Token with id ${address} not found on ${exchange} @ ${chainId}`)

  const token = await formatToken({
    ...tokenData,
    chain,
    exchange: exchangeDetails.name,
  })

  return token
}

export const getTokens = async (chainId: CHAINS, exchange: EXCHANGES, limit: number, cache: boolean = true) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const tokens = await getOrSetCache(
    `${chainId}/tokens?exchange=${exchange}&limit=${limit}`,
    async () => {
      const data = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKENS,
        variables: { first: limit },
      })
      console.log('GETTING QUERIES')
      // TODO: I can't get all the volume24h/liquidity24h/price24h from the original query, so unfortunately
      // we need to make multiple queries here to get all that information. luckily caching!
      return await Promise.all(
        data.tokens.map((token: any) => {
          console.log('token address+++++++++++++++++++', token.address)
          return getTokenByAddress(chainId, exchange, token.address, cache)
        }),
      )
    },
    cache,
  )

  return tokens
}

export const getTokensWithoutSevenDayData = async (
  chainId: CHAINS,
  exchange: EXCHANGES,
  limit: number,
  cache: boolean = true,
) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const tokens = await getOrSetCache(
    `${chainId}/tokens-without-seven-day-data?exchange=${exchange}&limit=${limit}`,
    async () => {
      const data = await subgraphHelper.getDataByQuery({
        client: subgraph.CLIENT,
        query: subgraph.QUERIES.TOKENS_WITHOUT_SEVEN_DAY_DATA,
        variables: { first: limit },
      })
      console.log('GETTING Token Addresses')
      return data.tokens
    },
    cache,
  )

  return tokens
}

export const getLeanTokens = async (chainId: CHAINS, exchange: EXCHANGES, limit: number) => {
  const subgraph = SUBGRAPHS[`${chainId}`]?.[`${exchange}`]

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  const tokens = await getOrSetCache(`${chainId}/lean-tokens?exchange=${exchange}&limit=${limit}`, async () => {
    const data = await subgraphHelper.getDataByQuery({
      client: subgraph.CLIENT,
      query: subgraph.QUERIES.TOKENS,
      variables: { first: limit },
    })
    console.log('GETTING Token Addresses')
    return data.tokens
  })

  return tokens
}

function reduceCandlestickToTradingView(tv: IHistory[], block: ICandleStickData): IHistory[] {
  tv.push({
    AMM: block.AMM,
    network: block.network,
    tokenId: block.tokenId,
    high: block.high,
    low: block.low,
    close: block.close,
    open: block.open,
    timestamp: (new Date(block.start).getTime() / 1000) >> 0,
    volume: block.volume,
  })
  return tv
}

function reduceCandlestickToTradingViewStable(tv: IHistory[], block: ICandleStickData): IHistory[] {
  tv.push({
    AMM: block.AMM,
    network: block.network,
    tokenId: block.tokenId,
    high: 1,
    low: 1,
    close: 1,
    open: 1,
    timestamp: (new Date(block.start).getTime() / 1000) >> 0,
    volume: 0,
  })
  return tv
}

function getCandlestickFromSwaps(
  pair: IRawPairData,
  swaps: any,
  initialReserves: any,
  timeFrameSeconds: number,
  token0IsNative: boolean,
  chain: CHAINS,
  exchange: EXCHANGES,
  tokenId: string,
) {
  const isV3 = exchange.includes('V3')

  const formattedSwaps = calculateReservesAndPrice(pair, swaps, initialReserves, token0IsNative, isV3)
  if (!formattedSwaps.length) return []
  const [start, end] = calculateTimeSlots(formattedSwaps[0].timestamp, timeFrameSeconds)
  const prices = chunkIntervalSwapData(start, end, formattedSwaps, timeFrameSeconds)
  return getCandlestickData(prices, token0IsNative, chain, exchange, tokenId)
}

function mergeCandles(candles: ICandleStickData[], base: ICandleStickData[]): ICandleStickData[] {
  const _base = base.reverse()
  const usdCandles: ICandleStickData[] = []

  for (const candle of candles.reverse()) {
    while (_base?.[0] && candle.start < _base[0].start) {
      _base.shift()
    }
    if (!_base.length || !candle?.start || !_base?.[0].start) {
      break
    }
    usdCandles.push({
      AMM: candle.AMM,
      network: candle.network,
      tokenId: candle.tokenId,
      high: candle.high * _base[0].high,
      low: candle.low * _base[0].low,
      open: candle.open * _base[0].open,
      close: candle.close * _base[0].close,
      volume: candle.volume,
      start: candle.start,
      end: candle.start,
    })
  }
  return usdCandles
}

async function getRecentCandles(
  chainId: CHAINS,
  exchange: EXCHANGES,
  chain: IChainConfiguration,
  factory: string,
  subgraph: any,
  startTime: number,
  endTime: number,
  timeFrameSeconds: number,
  token0: string,
  token1: string,
  cache: boolean = true,
  cacheTime: number = 15,
  tokenId: string,
) {
  console.log(
    `${chainId}/${exchange} - Fetching Candles between ${new Date(startTime).toLocaleString()} - ${new Date(
      endTime,
    ).toLocaleString()}`,
    {
      token0,
      token1,
    },
  )

  const isV3 = exchange.includes('V3')

  const data = await getOrSetCache(
    `tokens/historical?chainId=${chainId}&exchange=${exchange}&from=${startTime}&to=${endTime}&token0=${token0}&token1=${token1}`,
    async () => {
      const baseData = await fetchTokenHistoricalDataBetweenTimeStamps(
        token0,
        token1,
        subgraph,
        chain,
        factory,
        startTime,
        endTime,
        isV3,
      )
      if (!baseData) {
        console.log('NO DATA FOUND', {
          token0,
          token1,
          factory,
          startTime,
          endTime,
        })
      }

      const endIndexBase = baseData.swaps.findIndex(
        (swap: any) => new Date(swap.transaction.timestamp * 1000) < new Date(endTime),
      )
      const startIndexBase = baseData.swaps.findIndex(
        (swap: any) => new Date(swap.transaction.timestamp * 1000) < new Date(startTime),
      )
      // remove any swaps outside of the requested time frame
      baseData.swaps = baseData.swaps.slice(endIndexBase, startIndexBase)

      if (!baseData.swaps.length) {
        console.log(`No swap data from pair: ${token0} - ${token1} between ${startTime} and ${endTime}`)
      }

      return baseData
    },
    cache,
    cacheTime,
  )

  if (!data.swaps.length) {
    return []
  }

  // Fetch the exact reserves at that point in time
  const initialReserves = await subgraphHelper.getDataByQuery({
    client: subgraph.CLIENT,
    query: gql`
      query GetReservesAtBlock($pair: ID!, $block: Int!) {
        pair(id: $pair, block: { number: $block }) {
          reserve0
          reserve1
        }
      }
    `,
    variables: {
      pair: data.pair.id.toLowerCase(),
      block: Number(data.swaps[0].transaction.blockNumber),
    },
  })

  const initialReservesV3 = await subgraphHelper.getDataByQuery({
    client: subgraph.CLIENT,
    query: gql`
      query GetReservesAtBlock($pair: ID!, $block: Int!) {
        pair: pool(id: $pair, block: { number: $block }) {
          reserve0: volumeToken0
          reserve1: volumeToken1
        }
      }
    `,
    variables: {
      pair: data.pair.id.toLowerCase(),
      block: Number(data.swaps[0].transaction.blockNumber),
    },
  })

  return getCandlestickFromSwaps(
    data.pair,
    data.swaps,
    isV3 ? initialReservesV3 : initialReserves,
    timeFrameSeconds,
    !compareAddress(data.pair.token0.id, token0, chain.web3),
    chainId,
    exchange,
    tokenId,
  )
}

async function nativeStableCandles(
  isNativeToken: boolean,
  exchangeDetails: any,
  chain: IChainConfiguration,
  subgraph: any,
  baseStartTimeRecent: number,
  baseEndTimeRecent: number,
  timeFrameSeconds: number,
  tokenId: string,
) {
  console.log(`${chain.chainId}/${exchangeDetails.name}: Fetching ${isNativeToken ? 'Native' : 'Stable'} history`)
  // Normalize from to dates to blockchain format
  const baseCandles = await getRecentCandles(
    chain.chainId,
    exchangeDetails.name,
    chain,
    exchangeDetails.address,
    subgraph,
    baseStartTimeRecent,
    baseEndTimeRecent,
    timeFrameSeconds,
    chain.tokens.NATIVE,
    chain.tokens.STABLE,
    true,
    36000,
    tokenId,
  )
  const emptyHLOC: IHistory[] = []
  if (isNativeToken) {
    return baseCandles.reduce(reduceCandlestickToTradingView, emptyHLOC)
  }

  return baseCandles.reduce(reduceCandlestickToTradingViewStable, emptyHLOC)
}

export const getTokenHistorical = async (
  chainId: CHAINS,
  exchange: EXCHANGES | null,
  timeFrameSeconds: number,
  address: string,
  from: number,
  to: number,
  cache: boolean = true,
): Promise<IHistory[]> => {
  // Detect the best exchange to use
  const exchangeDetails = exchange
    ? getExchangeDetailsByName(exchange, chainId)
    : await findMostLiquidExchange(address, chainId)

  // Get Chain Configuration
  const chain = getChainConfiguration(chainId)
  const baseStartTimeRecent = ((from / 1000) >> 0) * 1000
  const baseEndTimeRecent = ((to / 1000) >> 0) * 1000

  const subgraph = SUBGRAPHS[`${chainId}`]?.[exchangeDetails.name]

  if (!address) {
    address = chain.tokens.FALLBACK
  }

  const isNativeToken = compareAddress(address, chain.tokens.NATIVE, chain.web3)
  const isStableToken = compareAddress(address, chain.tokens.STABLE, chain.web3)

  if (!subgraph) throw new BadRequestError('Invalid configuration error.')

  if (isNativeToken || isStableToken) {
    console.log(`isNativeToken: ${isNativeToken} || isStableToken: ${isStableToken}`)

    return nativeStableCandles(
      isNativeToken,
      exchangeDetails,
      chain,
      subgraph,
      baseStartTimeRecent,
      baseEndTimeRecent,
      timeFrameSeconds,
      `${address}_${getExchange(exchangeDetails.name, chainId)}`,
    )
  }

  const candleStartTimeRecent = ((from / 1000) >> 0) * 1000
  const candleEndTimeRecent = ((to / 1000) >> 0) * 1000

  // Normalize from to dates to blockchain format
  // Retrieve candles for Address/Native pair
  // Don't cache
  const candleRecent = await getRecentCandles(
    chainId,
    exchangeDetails.name,
    chain,
    exchangeDetails.address,
    subgraph,
    candleStartTimeRecent,
    candleEndTimeRecent,
    timeFrameSeconds,
    address,
    chain.tokens.NATIVE,
    false,
    undefined,
    `${address}_${getExchange(exchangeDetails.name, chainId)}`,
  )
  if (!candleRecent.length) {
    console.log('NO SWAPS >> ABORTING EARLY')
    throw new InsufficientDataError('NO SWAP DATA')
  }

  // Normalize from to dates to blockchain format
  // Retrieve candles for Native/Stable pair
  // Do cache
  const baseCandles = await getRecentCandles(
    chainId,
    exchangeDetails.name,
    chain,
    exchangeDetails.address,
    subgraph,
    // new Date(candleRecent[0].start).getTime(), // only get usdc-ftm prices for the tokens available time period
    baseStartTimeRecent,
    baseEndTimeRecent,
    timeFrameSeconds,
    chain.tokens.NATIVE,
    chain.tokens.STABLE,
    true, // enable caching
    36000, // Cache this data for 10 hours
    `${address}_${getExchange(exchangeDetails.name, chainId)}`,
  )

  const final = mergeCandles(candleRecent, baseCandles) // convert to usd
  const history = final.reduce(reduceCandlestickToTradingView, [])

  let result = await History.insertMany(history)

  return history
}

export const getTokenHistoricalFromDB = async (
  chainId: CHAINS,
  exchange: EXCHANGES,
  timeFrameSeconds: number,
  address: string,
  from: number,
  to: number,
) => {
  const token = await getTokenById(
    `${address}_${getExchange(exchange, chainId)}`,
    (new Date(from).getTime() / 1000) >> 0,
    (new Date(to).getTime() / 1000) >> 0,
  )
  // console.log('Before token')

  if (!token) throw new ResourceNotFoundError(`Token with address ${address} was not found on exchange ${exchange}`)
  // make sure that the token being returned is sorted by timestamp
  token?.history?.sort(function (x, y) {
    // This part makes sure that the history is sorted before it is added to the db
    return y.timestamp - x.timestamp
  })
  // console.log(`About to fail?`)

  // console.log(token?.history, token?.history_length)

  token.last_history = token.history[0]
  return token
}
// TODO: add network and dexes
export const getExchange = (exchange: EXCHANGES, chain: CHAINS) => {
  let result = chain.toString().toUpperCase()
  switch (exchange) {
    // case EXCHANGES.UNI_SWAP:
    //   return result + '_UNISWAP'
    // case EXCHANGES.PANCAKE_SWAP:
    //   return result + '_PANCAKE_SWAP'
    // case EXCHANGES.SPIRIT_SWAP:
    //   return result + '_SPIRIT_SWAP'
    // case EXCHANGES.SUSHI_SWAP:
    //   return result + '_SUSHI_SWAP'
    // case EXCHANGES.PAINT_SWAP:
    //   return result + '_PAINT_SWAP'
    // case EXCHANGES.ZOO_DEX:
    //   return result + '_ZOO_SWAP'
    // case EXCHANGES.SHIBA_SWAP:
    //   return result + '_SHIBA_SWAP'
    // case EXCHANGES.SPOOKY_SWAP:
    // return result + '_SPOOKY_SWAP'

    case EXCHANGES.FUSIONX_V2:
      return result + '_FUSIONX_V2'
    case EXCHANGES.FUSIONX_V3:
      return result + '_FUSIONX_V3'
    case EXCHANGES.PULSEX_V1:
      return result + '_PULSEX_V1'
    case EXCHANGES.PULSEX_V2:
      return result + '_PULSEX_V2'
    case EXCHANGES.ROCKET_SWAP:
      return result + '_ROCKET_SWAP'
    default:
      return result + `_${exchange}_SWAP`
  }
}

export default {
  getTokens,
  getTokenHistorical,
  getTokenHistoricalFromDB,
  getTokenByAddress,
  getExchange,
}
