import { Router } from 'express'

import mintController from '../controllers/mints'

const router = Router({ mergeParams: true })

router.route('/').get(mintController.getMints)

export default router
