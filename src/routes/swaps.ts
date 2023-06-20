import { Router } from 'express'

import swapController from '../controllers/swaps'

const router = Router({ mergeParams: true })

router.route('/').get(swapController.getSwaps)

export default router
