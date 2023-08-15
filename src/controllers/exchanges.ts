import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import exchangesHelper from './helpers/exchanges'

export const getSupportedExchanges = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const exchanges = await exchangesHelper.getSupportedExchanges()

  res.status(200).json(JsonResponse({ exchanges }))
})

export default {
  getSupportedExchanges,
}
