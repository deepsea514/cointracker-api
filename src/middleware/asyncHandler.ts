import { NextFunction, Request, Response } from 'express'
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export const wait = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve, ms)
  })

export default asyncHandler
