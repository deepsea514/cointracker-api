import { Router } from 'express'
import pricingRouter from './prices'
import chainRouter from './chains'
import mintRouter from './mints'
import burnRouter from './burns'
import swapRouter from './swaps'
import tokenRouter from './tokens'
import authRouter from './auth'
import liquidityRouter from './liquidity'
import exchangeRouter from './exchanges'
import pairRouter from './pairs'
import protectRoutes from '../middleware/protectRoutes'

const router = Router()

router.use('/auth', authRouter)
// router.use(protectRoutes)
router.use('/chains', chainRouter)
router.use('/mints', mintRouter)
router.use('/burns', burnRouter)
router.use('/prices', pricingRouter)
router.use('/swaps', swapRouter)
router.use('/tokens', tokenRouter)
router.use('/liquidity', liquidityRouter)
router.use('/exchanges', exchangeRouter)
router.use('/pairs', pairRouter)

export default router
