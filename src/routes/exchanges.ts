import { Router } from 'express'

import exchangeController from '../controllers/exchanges'

const router = Router({ mergeParams: true })

router.route('/').get(exchangeController.getSupportedExchanges)

export default router
