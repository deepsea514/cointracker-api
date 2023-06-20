import mongoose from 'mongoose'

export interface IExchange {
  name: string
  value: string
  desc: string
}

export interface IConfig {
  _id: string
  exchanges: IExchange[]
  symbols_types: string[]
  supported_resolutions: string[]
  supports_group_request: boolean
  supports_marks: boolean
  supports_search: boolean
  supports_timescale_marks: boolean
  supports_time: boolean
  currency_codes: string[]
}

const ConfigSchema = new mongoose.Schema<IConfig>({
  exchanges: [Object],
  symbols_types: [String],
  supported_resolutions: [String],
  supports_group_request: Boolean,
  supports_marks: Boolean,
  supports_search: Boolean,
  supports_timescale_marks: Boolean,
  supports_time: Boolean,
  currency_codes: [String],
})

const Config = mongoose.model<IConfig>('Config', ConfigSchema)

export default Config
