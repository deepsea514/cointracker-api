import mongoose, { Model } from 'mongoose'

export interface IPair {
  id: string
  token0Address: string
  token1Address: string
  token0Symbol: string
  token1Symbol: string
  pairAddress: string
  createdAtTimestamp: string
  createdAtBlock: string
  network: number
  AMM: string
  fee: string
}

const PairSchema = new mongoose.Schema<IPair>({
  pairAddress: {
    type: String,
    required: true,
  },
  token0Address: {
    type: String,
    required: true,
  },
  token1Address: {
    type: String,
    required: true,
  },
  token0Symbol: {
    type: String,
    required: true,
  },
  token1Symbol: {
    type: String,
    required: true,
  },
  createdAtTimestamp: {
    type: String,
    required: true,
  },
  createdAtBlock: {
    type: String,
    required: true,
  },
  network: {
    type: Number,
    required: true,
  },
  AMM: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: false,
  },
})

PairSchema.index({ pairAddress: 1 })

const Pair: Model<IPair> = mongoose.model<IPair>('Pair', PairSchema)

export default Pair
