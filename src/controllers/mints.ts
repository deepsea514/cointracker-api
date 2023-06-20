import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import mintHelper from './helpers/mints'
import { CHAINS, EXCHANGES } from '../constants/constants'

export const getMints = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Inputs
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15

  // Data
  const mints = await mintHelper.getMints(chainId, exchange, limit)

  res.status(200).json(JsonResponse({ mints }))
})
export default {
  getMints,
}
