import { Router } from 'express'

import pairController from '../controllers/pairs'

const router = Router({ mergeParams: true })

router.route('/:address').get(pairController.getPairsByToken)

export default router
