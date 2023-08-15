import { Router } from 'express'

import tokensController from '../controllers/tokens'

const router = Router({ mergeParams: true })

router.route('/').get(tokensController.getTokens)
router.route('/:token').get(tokensController.getTokenByAddress)
router.route('/:token/swaps').get(tokensController.getTokenSwaps)
router.route('/:token/mints').get(tokensController.getTokenMints)
router.route('/:token/burns').get(tokensController.getTokenBurns)
router.route('/:token/trading-view').get(tokensController.getTokenHistoricalFromDB)
router.route('/:token/fill-trading-view').get(tokensController.getTokenHistorical)

export default router
