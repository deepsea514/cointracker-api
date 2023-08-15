import CustomError from './CustomErrors'

export default (
  data: object,
  message: string = 'The operation succeeded!',
  success: boolean = true,
  errors: CustomError[] = [],
) => {
  return {
    success,
    data,
    errors,
    message,
  }
}
