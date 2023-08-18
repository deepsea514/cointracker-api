import Big from 'big.js'
import { CHAINS, EXCHANGES } from '../constants/constants'
import { InsufficientDataError } from './CustomErrors'

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
): ISwapDataset {
  return {
    // price of token0 relative to token1
    // TODO: this assumes token1 is FTM (or native token)
    open: token0IsNative ? openReserve0.div(openReserve1) : openReserve1.div(openReserve0),
    close: token0IsNative ? reserve0.div(reserve1) : reserve1.div(reserve0),
    reserve0,
    reserve1,
    block,
    timestamp,
    volume0,
    volume1,
  }
}

export function calculateTimeSlots(timestamp: number, interval: number): [number, number] {
  const now = new Date().getTime()
  let timeSlot = Math.min(timestamp + interval - (timestamp % interval), now - (now % interval)) // Complete the minute using current time as maximum
  let nextTime = timeSlot - interval // work backwards minute by minute
  return [nextTime, timeSlot]
}

export function chunkIntervalSwapData(
  timeSlotStart: number,
  timeSlotEnd: number,
  formattedSwaps: ISwapDataset[],
  timeFrameSeconds: number,
): IIntervalSwapData {
  const prices: IIntervalSwapData = {}

  // This loop goes ever <<TIME_INTERVAL>> and calculates price/details
  for (const [index, swap] of Object.entries(formattedSwaps)) {
    const previousSwap = Number(index) > 0 ? formattedSwaps[Number(index) - 1] : null
    if (swap.timestamp > timeSlotEnd) {
      // Incomplete Blocks, ignore, we will get next time
      // Maybe we want to show these as the get processed?
      // but for this script I just dropped them to simplify
      continue
    }

    // not equal to. equal to will fall into the next batch
    if (!prices[timeSlotEnd]) {
      prices[timeSlotEnd] = {
        // save names working (backwards, so endTime is now, and startTime is 1 minute ago
        // for processing, startTime is now, and endTime is 1 minute ago
        time: new Date(timeSlotEnd * 1000),
        startTime: timeSlotStart,
        endTime: timeSlotEnd - 0.001,
        block: swap.block,
        swaps: [], // record all swaps that fall in this timeframe here
      }
    }

    if (swap.timestamp > timeSlotStart && swap.timestamp <= timeSlotEnd) {
      prices[timeSlotEnd].swaps.push(swap)
      continue
    }

    // Use a do-while since for some minutes we have no swap data, but we still want to
    // create an entry for these minutes. this will run through all the backwards minutes
    // until we get to one with a swap again
    do {
      // update bracket times (time frames) to grab the next minute back
      timeSlotEnd = timeSlotStart
      timeSlotStart = timeSlotEnd - timeFrameSeconds

      // see above
      prices[timeSlotEnd] = {
        time: new Date(timeSlotEnd * 1000),
        startTime: timeSlotStart, // add a second so that a swap can't get into two time slots
        endTime: timeSlotEnd - 0.001,
        block: swap.block,
        swaps: [],
      }

      if (swap.timestamp <= timeSlotStart) {
        // No swap matches the time frame, so here we will spoof
        // a swap in order to get the open/close/high/low values to be copied
        // over (straight line on chart, no gaps on chart) maybe its better
        // to just leave this out though?
        if (previousSwap) {
          prices[timeSlotEnd].swaps.push({
            open: previousSwap.open,
            close: previousSwap.close,
            reserve0: previousSwap.reserve0,
            reserve1: previousSwap.reserve1,
            block: 0,
            timestamp: (timeSlotEnd + timeSlotStart) / 2, // just pick the average if the time interval
            volume0: 0,
            volume1: 0,
          })
        }
      }
    } while (swap.timestamp <= timeSlotStart)

    prices[timeSlotEnd].swaps.push(swap)
  }

  return prices
}

export function getCandlestickData(
  prices: IIntervalSwapData,
  token0IsNative: boolean,
  chain: CHAINS,
  exchange: EXCHANGES,
  tokenId: string,
): ICandleStickData[] {
  return Object.entries(prices).map(([timeSlotName, block]: [string, ISwapData]): ICandleStickData => {
    // console.log(block.swaps)
    // highest price
    const high = Math.max(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
    // lowest price
    const low = Math.min(...block.swaps.flatMap((s: any) => [s.open.toNumber(), s.close.toNumber()])) ?? 0
    // open price (lowest block number & lowest timestamp from group)
    const open =
      (block.swaps as any)
        .find(
          (swap: any) =>
            swap.block === Math.min(...block.swaps.map((s: any) => s.block)) &&
            swap.timestamp === Math.min(...block.swaps.map((s: any) => s.timestamp)),
        )
        ?.open.toNumber() ?? null
    // close price (highest block number & highest timestamp from group)
    const close =
      (block.swaps as any)
        .find(
          (swap: any) =>
            swap.block === Math.max(...block.swaps.map((s: any) => s.block)) &&
            swap.timestamp === Math.max(...block.swaps.map((s: any) => s.timestamp)),
        )
        ?.close.toNumber() ?? null

    const volume = block.swaps.reduce((acc, cur) => acc + (token0IsNative ? cur.volume0 : cur.volume1), 0) // TODO: check which is native (not token0)

    return {
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
    }
  })
}

type PairReserves = {
  pair: {
    reserve0: number
    reserve1: number
  }
}

export function calculateReservesAndPrice(
  pair: IRawPairData,
  swaps: any,
  initialReserves: PairReserves,
  token0IsNative: boolean,
  isV3: boolean,
) {
  // Get the first swap to calculate the current reserves balance
  const _firstRaw = swaps.shift()
  if (!_firstRaw) {
    return []
  }

  // Format the first swap into ISwapDataset
  const first = isV3
    ? formatSwap(
        token0IsNative,
        new Big(initialReserves.pair.reserve0).add(new Big(_firstRaw.amount0)), // reverse the swap to get the previous reserves balance
        new Big(initialReserves.pair.reserve1).add(new Big(_firstRaw.amount1)),
        new Big(initialReserves.pair.reserve0), // starting point is the current reserves balance
        new Big(initialReserves.pair.reserve1),
        +_firstRaw.transaction.blockNumber,
        +_firstRaw.transaction.timestamp,
        +_firstRaw.amount0,
        +_firstRaw.amount1,
      )
    : formatSwap(
        token0IsNative,
        new Big(initialReserves.pair.reserve0).add(new Big(_firstRaw.amount0In)).sub(new Big(_firstRaw.amount0Out)), // reverse the swap to get the previous reserves balance
        new Big(initialReserves.pair.reserve1).add(new Big(_firstRaw.amount1In)).sub(new Big(_firstRaw.amount1Out)),
        new Big(initialReserves.pair.reserve0), // starting point is the current reserves balance
        new Big(initialReserves.pair.reserve1),
        +_firstRaw.transaction.blockNumber,
        +_firstRaw.transaction.timestamp,
        +_firstRaw.amount0In + +_firstRaw.amount0Out,
        +_firstRaw.amount1In + +_firstRaw.amount1Out,
      )

  // Begin collecting the swaps, working backwards
  const formattedSwaps = [first]

  // This loop calculates the price & reserve balance during every swap
  for (const [index, swap] of Object.entries(swaps) as any) {
    const prevEntry = formattedSwaps[index] // always one behind 'swaps' since we used shift earlier & added the first swap manually
    formattedSwaps.push(
      isV3
        ? formatSwap(
            token0IsNative,
            prevEntry.reserve0,
            prevEntry.reserve1,
            prevEntry.reserve0.add(new Big(swap.amount0)),
            prevEntry.reserve1.add(new Big(swap.amount1)),
            +swap.transaction.blockNumber,
            +swap.transaction.timestamp,
            +swap.amount0In,
            +swap.amount1In,
          )
        : formatSwap(
            token0IsNative,
            prevEntry.reserve0,
            prevEntry.reserve1,
            prevEntry.reserve0.sub(new Big(swap.amount0In)).add(new Big(swap.amount0Out)),
            prevEntry.reserve1.sub(new Big(swap.amount1In)).add(new Big(swap.amount1Out)),
            +swap.transaction.blockNumber,
            +swap.transaction.timestamp,
            +swap.amount0In + +swap.amount0Out,
            +swap.amount1In + +swap.amount1Out,
          ),
    )
  }

  return formattedSwaps
}
