import Big from 'big.js'
import { CHAINS, EXCHANGES } from '../constants/constants'
import History from '../models/historySchema'

export interface ISwapDataset {
  open: Big
  close: Big
  reserve0: Big
  reserve1: Big
  block: number
  timestamp: number
  volume0: number
  volume1: number
}

export interface ISwapData {
  time: Date
  startTime: number
  endTime: number
  block: number
  swaps: ISwapDataset[] // record all swaps that fall in this timeframe here
}
export interface IIntervalSwapData {
  [key: number]: ISwapData
}

export interface IRawSwapData {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  transaction: {
    blockNumber: string
    timestamp: string
    id: string
  }
}

export interface IRawSwapDataV3 {
  amount0: string
  amount1: string
  transaction: {
    blockNumber: string
    timestamp: string
    id: string
  }
}

export interface IRawPairData {
  reserve0: string
  reserve1: string
  token0: { id: string; decimals: string }
  token1: { id: string; decimals: string }
}

export interface ICandleStickData {
  AMM: string
  network: string
  tokenId: string
  high: number
  low: number
  open: number
  close: number
  volume: number
  start: Date
  end: Date
}

export function formatSwap(
  token0IsNative: boolean,
  openReserve0: Big,
  openReserve1: Big,
  reserve0: Big,
  reserve1: Big,
  block: number,
  timestamp: number,
  volume0: number,
  volume1: number,
  isV3: boolean,
): ISwapDataset {
  if (isV3) {
    return {
      open: token0IsNative ? openReserve1 : openReserve0,
      close: token0IsNative ? openReserve1 : openReserve0,
      reserve0,
      reserve1,
      block,
      timestamp,
      volume0,
      volume1,
    }
  }
  return {
    // price of token0 relative to token1
    // TODO: this assumes token1 is FTM (or native token)
    open: token0IsNative ? openReserve1.div(openReserve0) : openReserve0.div(openReserve1),
    close: token0IsNative ? reserve1.div(reserve0) : reserve0.div(reserve1),
    reserve0,
    reserve1,
    block,
    timestamp,
    volume0,
    volume1,
  }
}

export function calculateTimeSlots(startTimestamp: number, endTimestamp: number, interval: number): [number, number] {
  const now = new Date().getTime()
  let startTimeSlot = Math.min(startTimestamp + interval - (startTimestamp % interval), now - (now % interval)) // Complete the minute using current time as maximum
  let endTimeSlot = Math.min(endTimestamp + interval - (endTimestamp % interval), now - (now % interval)) // Complete the minute using current time as maximum
  return [startTimeSlot, endTimeSlot]
}

export function chunkIntervalSwapData(
  timeSlotStart: number,
  timeSlotEnd: number,
  formattedSwaps: ISwapDataset[],
  timeFrameSeconds: number,
): IIntervalSwapData {
  const prices: IIntervalSwapData = {}

  let swapIndex = 0
  for (timeSlotStart += timeFrameSeconds; timeSlotStart < timeSlotEnd; timeSlotStart += timeFrameSeconds) {
    const previousSwap = swapIndex > 1 ? formattedSwaps[swapIndex - 1] : null

    prices[timeSlotStart] = {
      time: new Date(timeSlotStart * 1000),
      startTime: timeSlotStart - timeFrameSeconds,
      endTime: timeSlotStart - 0.001,
      block: 0,
      swaps: [], // record all swaps that fall in this timeframe here
    }

    if (previousSwap) {
      prices[timeSlotStart].swaps.push({
        open: previousSwap.open,
        close: previousSwap.close,
        reserve0: previousSwap.reserve0,
        reserve1: previousSwap.reserve1,
        block: previousSwap.block,
        timestamp: previousSwap.timestamp, // just pick the average if the time interval
        volume0: 0,
        volume1: 0,
      })

      prices[timeSlotStart].block = previousSwap.block
    }

    if (swapIndex >= formattedSwaps.length) continue

    while (formattedSwaps[swapIndex].timestamp < timeSlotStart) {
      const swap = formattedSwaps[swapIndex]
      prices[timeSlotStart].swaps.push(swap)
      prices[timeSlotStart].block = swap.block
      swapIndex++
    }
  }

  return prices
}

export async function getCandlestickData(
  prices: IIntervalSwapData,
  token0IsNative: boolean,
  chain: CHAINS,
  exchange: EXCHANGES,
  tokenId: string,
): Promise<ICandleStickData[]> {
  const result: ICandleStickData[] = []

  const priceEntries = Object.entries(prices)
  for (let index = 0; index < priceEntries.length; index++) {
    const [timeSlotName, block]: [string, ISwapData] = priceEntries[index]

    let high = 0,
      low = 0,
      close = 0,
      open = 0,
      volume = 0

    if (block.swaps.length === 0) {
      if (index !== 0) {
        high = low = open = close = result[index - 1].close
      } else {
        try {
          const historical = await History.find({ tokenId }).sort({ timestamp: 'desc' }).limit(1)
          if (historical.length) {
            high = low = open = close = historical[0].close
          }
        } catch (error) {}
      }
    } else {
      // highest price
      high = Math.max(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
      // lowest price
      low = Math.min(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
      // open price will be the close price of previous candle
      open = block.swaps[0]?.close.toNumber() ?? null
      // close price is the last close
      close = block.swaps[block.swaps.length - 1]?.close.toNumber() ?? null
      // Volumn
      volume = block.swaps.reduce((acc, cur) => acc + (token0IsNative ? cur.volume0 : cur.volume1), 0) // TODO: check which is native (not token0)
    }

    result.push({
      AMM: exchange,
      network: chain.toString(),
      tokenId,
      high,
      low,
      open,
      close,
      volume, // TODO: use volume of non-native asset
      start: new Date(block.startTime * 1000),
      end: new Date(block.endTime * 1000),
    })
  }

  return result
  // return await Promise.all(
  //   Object.entries(prices).map(async ([timeSlotName, block]: [string, ISwapData]): Promise<ICandleStickData> => {
  //     let high = 0,
  //       low = 0,
  //       close = 0,
  //       open = 0,
  //       volume = 0

  //     if (block.swaps.length === 0) {
  //       const previousBlockSwaps = prices[Number(timeSlotName) - 60].swaps
  //       if (previousBlockSwaps && previousBlockSwaps.length !== 0) {
  //         high = low = open = close = previousBlockSwaps[previousBlockSwaps.length - 1].close.toNumber()
  //       } else {
  //         try {
  //           const historical = await History.find({ tokenId }).sort({ timestamp: 'desc' }).limit(1)
  //           if (historical.length) {
  //             high = low = open = close = historical[0].close
  //           }
  //         } catch (error) {}
  //       }
  //     } else {
  //       // highest price
  //       high = Math.max(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
  //       // lowest price
  //       low = Math.min(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
  //       // open price will be the close price of previous candle
  //       open = block.swaps[0]?.close.toNumber() ?? null
  //       // close price is the last close
  //       close = block.swaps[block.swaps.length - 1]?.close.toNumber() ?? null
  //       // Volumn
  //       volume = block.swaps.reduce((acc, cur) => acc + (token0IsNative ? cur.volume0 : cur.volume1), 0) // TODO: check which is native (not token0)
  //     }

  //     return {
  //       AMM: exchange,
  //       network: chain.toString(),
  //       tokenId,
  //       high,
  //       low,
  //       open,
  //       close,
  //       volume, // TODO: use volume of non-native asset
  //       start: new Date(block.startTime * 1000),
  //       end: new Date(block.endTime * 1000),
  //     }
  //   }),
  // )
}

type PairReserves = {
  pair: {
    reserve0: number
    reserve1: number
    token0Price?: number
    token1Price?: number
  }
}

export function calculateReservesAndPrice(
  pair: IRawPairData,
  swaps: any[],
  initialReserves: PairReserves,
  token0IsNative: boolean,
  isV3: boolean,
) {
  if (!swaps.length) {
    return []
  }

  if (isV3) {
    const formattedSwaps = swaps.map((swap) => {
      const [token0Price, token1Price] = sqrtPriceX96ToTokenPrices(
        new Big(swap.sqrtPriceX96),
        Number(pair.token0.decimals),
        Number(pair.token1.decimals),
      )
      return formatSwap(
        token0IsNative,
        token0Price,
        token1Price,
        new Big(0),
        new Big(0),
        +swap.transaction.blockNumber,
        +swap.transaction.timestamp,
        +swap.amount0,
        +swap.amount1,
        isV3,
      )
    })

    return formattedSwaps.reverse()
  }

  // Get the first swap to calculate the current reserves balance
  const _firstRaw = swaps.shift()
  // Format the first swap into ISwapDataset
  const first = formatSwap(
    token0IsNative,
    new Big(initialReserves.pair.reserve0).add(new Big(_firstRaw.amount0In)).sub(new Big(_firstRaw.amount0Out)), // reverse the swap to get the previous reserves balance
    new Big(initialReserves.pair.reserve1).add(new Big(_firstRaw.amount1In)).sub(new Big(_firstRaw.amount1Out)),
    new Big(initialReserves.pair.reserve0), // starting point is the current reserves balance
    new Big(initialReserves.pair.reserve1),
    +_firstRaw.transaction.blockNumber,
    +_firstRaw.transaction.timestamp,
    +_firstRaw.amount0In + +_firstRaw.amount0Out,
    +_firstRaw.amount1In + +_firstRaw.amount1Out,
    isV3,
  )

  // Begin collecting the swaps, working backwards
  const formattedSwaps = [first]

  // This loop calculates the price & reserve balance during every swap
  for (const [index, swap] of Object.entries(swaps) as any) {
    const prevEntry = formattedSwaps[index] // always one behind 'swaps' since we used shift earlier & added the first swap manually
    formattedSwaps.push(
      formatSwap(
        token0IsNative,
        prevEntry.reserve0,
        prevEntry.reserve1,
        prevEntry.reserve0.sub(new Big(swap.amount0In)).add(new Big(swap.amount0Out)),
        prevEntry.reserve1.sub(new Big(swap.amount1In)).add(new Big(swap.amount1Out)),
        +swap.transaction.blockNumber,
        +swap.transaction.timestamp,
        +swap.amount0In + +swap.amount0Out,
        +swap.amount1In + +swap.amount1Out,
        isV3,
      ),
    )
  }

  return formattedSwaps.reverse()
}

const Q192 = new Big(2).pow(192)
export function sqrtPriceX96ToTokenPrices(sqrtPriceX96: Big, token0Decimals: number, token1Decimals: number): Big[] {
  const num = sqrtPriceX96.mul(sqrtPriceX96)
  const price1 = num.div(Q192).times(new Big(10).pow(token0Decimals)).div(new Big(10).pow(token1Decimals))

  const price0 = new Big(1).div(price1)
  return [price0, price1]
}
