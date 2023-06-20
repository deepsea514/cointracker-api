import mongoose from 'mongoose'

export interface ISymbol {
  _id: string
  name: string
  description: string
  currency_code: string
  exchange: string
  price_scale: number
  ticker: string
  full_name: string
  listed_exchange: string
  type: string
  session: string
  data_status: string
  has_daily: boolean
  has_weekly_and_monthly: boolean
  has_empty_bars: boolean
  force_session_rebuild: boolean
  has_no_volume: boolean
  volume_precision: number
  timezone: string
  format: string
  min_mov: number
  has_intra_day: boolean
  supported_resolutions: string[]
}

const SymbolSchema = new mongoose.Schema<ISymbol>({
  name: String,
  description: String,
  currency_code: String,
  exchange: String,
  price_scale: Number,
  ticker: String,
  full_name: String,
  listed_exchange: String,
  type: String,
  session: String,
  data_status: String,
  has_daily: Boolean,
  has_weekly_and_monthly: Boolean,
  has_empty_bars: Boolean,
  force_session_rebuild: Boolean,
  has_no_volume: Boolean,
  volume_precision: Number,
  timezone: String,
  format: String,
  min_mov: Number,
  has_intra_day: Boolean,
  supported_resolutions: [String],
})

const Symbol = mongoose.model<ISymbol>('Symbol', SymbolSchema)

export default Symbol
