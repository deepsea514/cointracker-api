import { NextFunction, Request, Response } from 'express'
import CustomError from '../utils/CustomErrors'
import JsonResponse from '../utils/JsonResponse'

export default (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  let error: CustomError
  switch (err.name) {
    case 'PageNotFoundError':
    case 'InsufficientDataError':
    case 'PairUnavailableError':
    case 'BadRequestError':
    case 'CustomError':
    case 'ResourceNotFoundError':
    case 'SubgraphError':
      error = err as CustomError
      break
    default:
      error = new CustomError(500, err.name, err.message)
      break
  }

  res.status(error.statusCode).json(JsonResponse({}, err.message, false, [error]))
}
