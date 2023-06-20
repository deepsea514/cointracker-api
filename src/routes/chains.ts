import { Router } from 'express'

import chainsController from '../controllers/chains'

const router = Router()

router.route('/').get(chainsController.getChains)

export default router
