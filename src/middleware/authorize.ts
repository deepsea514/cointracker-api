import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userSchema'
import { Request } from '../types'
import { UnAuthorizedError } from '../utils/CustomErrors'
import asyncHandler from './asyncHandler'

export default asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) throw new UnAuthorizedError()

  const { sub } = jwt.verify(token, process.env.JWT_SECRET as string)

  if (!sub) throw new UnAuthorizedError()

  const user = await User.findById(sub)

  if (!user) throw new UnAuthorizedError()

  req.authenticatedUser = user
  next()
})
