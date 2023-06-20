import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 as uuidV4 } from 'uuid'
import { ForbiddenError } from '../utils/CustomErrors'
import { API } from '../constants/constants'

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  key: string
  secret: string
  tokens: string[]
  apiUsage: { [x: string]: number }
  monthlyLimit: number
  comparePassword: (password: string) => boolean
  getAuthenticationToken: () => Promise<string>
  generateAPIKey: () => Promise<string>
  generateAPISecret: () => Promise<string>
}

interface IUserModel extends mongoose.Model<IUser> {
  getUserByToken: (token: string) => Promise<IUser>
  findByEmail: (email: string) => Promise<IUser>
  authenticateAPIUsage: (key: string, secret: string) => Promise<boolean>
}

const generateUUID = () => {
  return uuidV4().split('-').join('')
}

const getCurrentMonth = () => {
  const date = new Date()
  return `${date.getUTCFullYear()}_${date.getUTCMonth() + 1}`
}

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUser>(
  {
    name: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    key: {
      type: String,
      default: generateUUID,
    },
    secret: {
      type: String,
      default: generateUUID,
      select: false,
    },
    tokens: [String],
    apiUsage: { type: Object, default: { [`${getCurrentMonth()}`]: 0 } },
    monthlyLimit: {
      type: Number,
      default: 5000, // By Default, there is no limit on usage?
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

/**
 * Methods for users.
 */

// Compare a string with encrypted password
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// Issue a token that expires in 1day!
UserSchema.methods.getAuthenticationToken = async function () {
  const token = jwt.sign({ sub: this._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRY })
  this.tokens.push(token)
  await this.save()
  return token
}

// Generate API key for the user
UserSchema.methods.generateAPIKey = async function () {
  this.key = uuidV4()

  await this.save()
  return this.key
}

// Generate API secret for the user
UserSchema.methods.generateAPISecret = async function () {
  this.secret = uuidV4()

  await this.save()
  return this.secret
}

/**
 * Statics for Users
 */

// Find a user by JWT token
UserSchema.statics.getUserByToken = async function (token: string) {
  const { sub } = jwt.verify(token, process.env.JWT_SECRET as string)
  return await this.findById(sub)
}

// Authenticate API usage and check usage limitations
UserSchema.statics.authenticateAPIUsage = async function (key: string, secret: string) {
  if (API.KEYS.includes(key) && API.SECRETS.includes(secret)) return true // To be used for development only
  const user = await this.findOne({ key, secret })
  if (!user) throw new ForbiddenError('Invalid API credentials')

  const month = getCurrentMonth()
  let apiUsage = user.apiUsage
  const monthKeyExists = month in apiUsage

  if (!monthKeyExists) apiUsage[`${month}`] = 0

  if (user.monthlyLimit < 0 || apiUsage[`${month}`] < user.monthlyLimit) {
    apiUsage[`${month}`] += 1
    user.apiUsage = apiUsage
    user.markModified('apiUsage')
    await user.save()
    return true
  }

  return false
}

const User = mongoose.model<IUser, IUserModel>('User', UserSchema)

export default User
