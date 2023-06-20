export default class CustomError extends Error {
  statusCode: number
  constructor(statusCode: number = 500, name: string = 'CustomError', message: string = 'There was a CustomError') {
    super(message)
    this.statusCode = statusCode
    this.name = name
  }
}

export class PageNotFoundError extends CustomError {
  constructor() {
    super(404, 'PageNotFoundError', `The requested page cannot be found!`)
  }
}

export class ResourceNotFoundError extends CustomError {
  constructor(message: string = `The requested resource cannot be found!`) {
    super(404, 'ResourceNotFoundError', message)
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, name?: string) {
    super(400, name ?? 'BadRequestError', message)
  }
}

export class UnAuthorizedError extends CustomError {
  constructor(message: string = 'Authorization Failed') {
    super(401, 'UnAuthorizedError', message)
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Action Forbidden') {
    super(403, 'ForbiddenError', message)
  }
}

export class InsufficientDataError extends BadRequestError {
  constructor(message: string, name?: string) {
    super(message, name ?? 'InsufficientDataError')
  }
}

export class PairUnavailableError extends BadRequestError {
  constructor(message: string, name?: string) {
    super(message, name ?? 'PairUnavailableError')
  }
}

export class SubgraphError extends BadRequestError {
  constructor(message: string) {
    super(message, 'SubgraphError')
  }
}
