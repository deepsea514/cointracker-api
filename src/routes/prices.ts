import { Router } from 'express'

import pricingController from '../controllers/prices'

const router = Router({ mergeParams: true })

router.route('/').post(pricingController.getPricing)
router.route('/historical').get(pricingController.getHistoricalPricing)

export default router
