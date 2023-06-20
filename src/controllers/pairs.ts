import { NextFunction, Request, Response } from 'express'
import { CHAINS, EXCHANGES } from '../constants/constants'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import { getPairsByTokenFromDB } from './helpers/pairs'

const getPairsByToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params
  const { chainId, exchange } = req.query
  const pairs = await getPairsByTokenFromDB(address, chainId as unknown as CHAINS, exchange as EXCHANGES)

  res.status(200).json(JsonResponse({ numberOfPairs: pairs.length, pairs }))
})

export default {
  getPairsByToken,
}
