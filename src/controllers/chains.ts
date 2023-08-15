import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import * as chainHelper from './helpers/chains'

const getChains = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chains = await chainHelper.getChains()
  res.status(200).json(JsonResponse({ chains }))
})

export default {
  getChains,
}
