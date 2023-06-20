import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import swapsHelper from './helpers/swaps'
import { CHAINS, EXCHANGES } from '../constants/constants'

export const getSwaps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15

  const swaps = await swapsHelper.getSwaps(chainId, exchange, limit)

  res.status(200).json(JsonResponse({ swaps }))
})

export default {
  getSwaps,
}
