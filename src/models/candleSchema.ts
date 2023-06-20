import mongoose, { Document } from 'mongoose'
import { CHAINS } from '../constants/constants'

export interface ICandle extends Document {
  high: number
  low: number
  open: number
  close: number
  volume: number
  start: Date
  end: Date
  address: string
  chainId: CHAINS
}

const CandleSchema = new mongoose.Schema<ICandle>({
  high: Number,
  low: Number,
  open: Number,
  close: Number,
  volume: Number,
  start: Date,
  end: Date,
  address: String,
  chainId: String,
})

const Candle = mongoose.model<ICandle>('Candle', CandleSchema)

export default Candle
