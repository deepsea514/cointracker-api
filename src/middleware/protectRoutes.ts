import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userSchema'
import { Request } from '../types'
import { UnAuthorizedError, ForbiddenError } from '../utils/CustomErrors'
import asyncHandler from './asyncHandler'

export default asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { key, secret } = req.query

  if (!key || !secret) throw new UnAuthorizedError()

  const allowUsage = await User.authenticateAPIUsage(key as string, secret as string)

  if (!allowUsage) throw new ForbiddenError(`Monthly API Limit exceeded. Contact support!`)

  next()
})
