import { Router } from 'express'
import authController from '../controllers/auth'
import authorize from '../middleware/authorize'

const router = Router({ mergeParams: true })

router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/').get([authorize], authController.getAuthenticatedUser)
router.route('/secret').get([authorize], authController.getSecretByAuthenticatedUser)

export default router
