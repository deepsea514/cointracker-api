import mongoose, { Document } from 'mongoose'

export interface IMintEvent extends Document {
  transactionAddress: string
  timestamp: number
  blockNumber: number
  to: string
  pairAddress: string
  sender: string
  token0Address: string
  token1Address: string
  token0Symbol: string
  token1Symbol: string
  amount0: number
  amount1: number
  amountUSD: string
  amountMETIS?: number
  pairLiquidityUSD: number
  pairLiquidityMETIS?: number
  token0PriceUSD: number
  token1PriceUSD: number
  token0PriceMETIS?: number
  token1PriceMETIS?: number
  walletAddress: string
  walletCategory: string
  AMM: string
  network: string
}

const MintSchema = new mongoose.Schema<IMintEvent>({
  transactionAddress: String,
  timestamp: Number,
  blockNumber: Number,
  to: String,
  sender: String,
  pairAddress: String,
  token0Address: String,
  token1Address: String,
  token0Symbol: String,
  token1Symbol: String,
  amount0: Number,
  amount1: Number,
  amountUSD: String,
  amountMETIS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1088
    },
  },
  pairLiquidityUSD: Number,
  pairLiquidityMETIS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token0PriceUSD: Number,
  token0PriceMETIS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token1PriceUSD: Number,
  token1PriceMETIS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1088
    },
  },
  walletAddress: String,
  walletCategory: String,
  AMM: String,
  network: String,
})

const Mint = mongoose.model<IMintEvent>('Mint', MintSchema)

export default Mint
