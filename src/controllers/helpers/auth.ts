import bcrypt from 'bcryptjs'
import User from '../../models/userSchema'
import { BadRequestError, ResourceNotFoundError, UnAuthorizedError } from '../../utils/CustomErrors'

export const register = async (name: string, email: string, password: string) => {
  if (!email || !password) throw new BadRequestError('Both Email and Password are required!')

  const alreadyExists = await User.findOne({ email })

  if (alreadyExists) throw new BadRequestError('Email already in use')

  const user = await User.create({ name, email, password: hashString(password) })

  if (!user) throw new BadRequestError('Failed to register the user!')

  const token = await user.getAuthenticationToken()

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    auth: {
      token,
    },
    api: {
      key: user.key,
    },
  }
}

const hashString = (str: string) => {
  return bcrypt.hashSync(str, bcrypt.genSaltSync(10))
}

export const login = async (email: string, password: string) => {
  if (!email || !password) throw new UnAuthorizedError('Invalid Credentials')

  const user = await User.findOne({ email }).select('+secret +password')

  if (!user) throw new UnAuthorizedError('Invalid Credentials')

  const isCorrectCredential = user.comparePassword(password)

  if (!isCorrectCredential) throw new UnAuthorizedError('Invalid Credentials')

  const token = await user.getAuthenticationToken()

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    auth: {
      token,
    },
    api: {
      key: user.key,
    },
  }
}

export const getSecretByUserId = async (id: string) => {
  const user = await User.findById(id).select('secret')

  if (!user) throw new ResourceNotFoundError('User not found.')

  return user?.secret
}

export default {
  register,
  login,
  getSecretByUserId,
}
