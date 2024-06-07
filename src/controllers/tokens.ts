import { NextFunction, Request, Response } from 'express'
import { CHAINS, EXCHANGES } from '../constants/constants'
import asyncHandler from '../middleware/asyncHandler'
import Token from '../models/tokenSchema'
import JsonResponse from '../utils/JsonResponse'
import { getChainConfiguration } from '../utils/chain/chainConfiguration'
import burnsHelper from './helpers/burns'
import mintsHelper from './helpers/mints'
import swapsHelper from './helpers/swaps'
import tokensHelper from './helpers/tokens'

export const getTokens = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15
  // const tokens = await tokensHelper.getTokens(chainId, exchange, limit)
  const searchObject: { network?: number; AMM?: string } = {}
  if (chainId) {
    searchObject.network = chainId as number
  }
  if (exchange) {
    searchObject.AMM = exchange
  }
  const tokens = await Token.find(searchObject)
    .sort({ liquidityETH: 'desc' })
    .limit(limit || 30)

  const formattedTokens = (
    await Promise.all(
      tokens.map((token) => tokensHelper.getTokenByAddress(chainId, token.AMM as EXCHANGES, token.address, true)),
    )
  ).filter((token) => token != null)

  res.status(200).json(JsonResponse({ tokens: formattedTokens }))
})

export const getTokenSwaps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const address = req.params.token as unknown as string
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15
  const swaps = await swapsHelper.getTokenSwaps(chainId, exchange, limit, address)

  res.status(200).json(JsonResponse({ swaps }))
})

export const getTokenMints = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const address = req.params.token as unknown as string
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15
  const mints = await mintsHelper.getTokenMints(chainId, exchange, limit, address)

  res.status(200).json(JsonResponse({ mints }))
})

export const getTokenBurns = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const address = req.params.token as unknown as string
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15
  const burns = await burnsHelper.getTokenBurns(chainId, exchange, limit, address)

  res.status(200).json(JsonResponse({ burns }))
})

export const getTokenHistorical = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  /**
   * // required
   * chainId = 250 (fantom)
   * address (token address)
   *
   * // optional
   * exchange (optional, will detect highest liquidity exchange by default)
   * resolution (number of seconds in time frame - see examples below)
   * to (end time, defaults to now)
   * from (start time, defaults to earlier than now)
   */
  const chainId = req.query.chainId as unknown as CHAINS
  let exchange = req.query.exchange as unknown as EXCHANGES // TODO: auto swap
  const resolution = parseInt(req.query.resolution as string) || 60 // 60=1m, 3600=1hr, 14400=4h, resolution in seconds
  const chain = getChainConfiguration(chainId as CHAINS)
  const address = (req.params.token ?? chain.tokens.FALLBACK).toLowerCase()

  // Default to the last XXX candles (adjusted to resolution)
  let to = parseInt(req.query.to as string) || new Date().getTime()
  let defaultCandleCount = 240

  let from = parseInt(req.query.from as string) || to - resolution * 1000 * (defaultCandleCount - 1)
  const tokens = await tokensHelper.getTokenHistorical(chainId, exchange, resolution, address, from, to)

  res.status(200).json(JsonResponse({ tokens }))
})

export const getTokenHistoricalFromDB = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  let exchange = req.query.exchange as unknown as EXCHANGES
  const resolution = parseInt(req.query.resolution as string) || 60
  const chain = getChainConfiguration(chainId as CHAINS)
  const address = (req.params.token ?? chain.tokens.FALLBACK).toLowerCase()

  let to = parseInt(req.query.to as string) || new Date().getTime()
  let defaultCandles = {
    // TODO: add network
    // 250: 240, // ~240 seconds
    // 56: 80, // ~240 seconds
    // 369: 80, // ~240 seconds
    // 5000: 80, // ~240 seconds
    // 8453: 80, // ~240 seconds
    1: 20, // ~240 seconds
    1088: 26, // ~240 seconds
    // 100: 28, // ~240
    // 137: 240, // ~240
  }
  let defaultCandleCount = defaultCandles[chain.chainId]

  let from = parseInt(req.query.from as string) || to - resolution * 1000 * (defaultCandleCount - 1)
  const tokens = await tokensHelper.getTokenHistoricalFromDB(chainId, exchange, resolution, address, from, to)

  res.status(200).json(JsonResponse({ tokens }))
})

export const getTokenByAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const address = req.params.token

  const token = await tokensHelper.getTokenByAddress(chainId, exchange, address)
  res.status(200).json(JsonResponse({ token }))
})

export default {
  getTokens,
  getTokenSwaps,
  getTokenMints,
  getTokenBurns,
  getTokenHistorical,
  getTokenHistoricalFromDB,
  getTokenByAddress,
}
