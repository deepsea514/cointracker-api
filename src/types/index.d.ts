import { IUser } from '../models/userSchema'
import { Request as ExpressRequest } from 'express'

export interface Request extends ExpressRequest {
  authenticatedUser: IUser
}
