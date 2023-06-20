import { NextFunction, Request, Response } from 'express'
import { PageNotFoundError } from '../utils/CustomErrors'

export default (req: Request, res: Response, next: NextFunction) => {
  throw new PageNotFoundError()
}
