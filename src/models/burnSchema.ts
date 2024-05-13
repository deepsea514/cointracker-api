import mongoose, { Document } from 'mongoose'

export interface IBurnEvent extends Document {
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
  amountETH?: number
  amountMETIS?: number
  pairLiquidityUSD: number
  pairLiquidityETH?: number
  pairLiquidityMETIS?: number
  token0PriceUSD: number
  token1PriceUSD: number
  token0PriceETH?: number
  token1PriceETH?: number
  token0PriceMETIS?: number
  token1PriceMETIS?: number
  walletAddress: string
  walletCategory: string
  AMM: string
  network: string
}

const BurnSchema = new mongoose.Schema<IBurnEvent>({
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
  amountETH: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1
    },
  },
  amountMETIS: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1088
    },
  },
  pairLiquidityUSD: Number,
  pairLiquidityETH: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1
    },
  },
  pairLiquidityMETIS: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token0PriceUSD: Number,
  token0PriceETH: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1
    },
  },
  token0PriceMETIS: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token1PriceUSD: Number,
  token1PriceETH: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1
    },
  },
  token1PriceMETIS: {
    type: Number,
    required: function (this: IBurnEvent) {
      return parseInt(this.network) == 1088
    },
  },
  walletAddress: String,
  walletCategory: String,
  AMM: String,
  network: String,
})

const Burn = mongoose.model<IBurnEvent>('Burn', BurnSchema)

export default Burn
