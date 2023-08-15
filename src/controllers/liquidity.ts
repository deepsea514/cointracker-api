import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import burnsHelper from './helpers/burns'
import mintsHelper from './helpers/mints'
import { CHAINS, EXCHANGES } from '../constants/constants'

export const getLiquidity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as unknown as CHAINS
  const exchange = req.query.exchange as unknown as EXCHANGES
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 15

  const burns = await burnsHelper.getBurns(chainId, exchange, limit)
  const mints = await mintsHelper.getMints(chainId, exchange, limit)

  const liquidity = getLiquidityFromMintsAndBurns(mints, burns, limit)

  res.status(200).json(JsonResponse({ liquidity }))
})

const getLiquidityFromMintsAndBurns = (mints: any[], burns: any[], limit: number) => {
  const burnsWithType = burns.map((burn: any) => ({ ...burn, eventType: 'burn' }))
  const mintsWithType = mints.map((mint: any) => ({ ...mint, eventType: 'mint' }))
  const liquidity = [...mintsWithType, ...burnsWithType]

  liquidity.sort(function (x, y) {
    return parseInt(y.timestamp) - parseInt(x.timestamp)
  })

  const slicedLiquidity = liquidity.slice(0, limit)

  return slicedLiquidity
}

export default {
  getLiquidity,
}
