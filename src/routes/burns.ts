import { Router } from 'express'

import burnController from '../controllers/burns'

const router = Router({ mergeParams: true })

router.route('/').get(burnController.getBurns)

export default router
