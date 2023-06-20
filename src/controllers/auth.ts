import { NextFunction, Response } from 'express'
import { Request } from '../types'
import asyncHandler from '../middleware/asyncHandler'
import JsonResponse from '../utils/JsonResponse'
import authHelper from './helpers/auth'

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body

  const data = await authHelper.register(name, email, password)
  res.status(200).json(JsonResponse(data))
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  const data = await authHelper.login(email, password)
  res.status(200).json(JsonResponse(data))
})

export const getAuthenticatedUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.authenticatedUser

  res.status(200).json(JsonResponse({ user }))
})

export const getSecretByAuthenticatedUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.authenticatedUser
  const secret = await authHelper.getSecretByUserId(user._id)
  res.status(200).json(JsonResponse({ secret }))
})

export default {
  register,
  login,
  getAuthenticatedUser,
  getSecretByAuthenticatedUser,
}
