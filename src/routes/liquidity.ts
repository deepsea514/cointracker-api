import { Router } from 'express'

import liquidityController from '../controllers/liquidity'

const router = Router({ mergeParams: true })

router.route('/').get(liquidityController.getLiquidity)

export default router
