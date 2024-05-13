import mongoose, { Document } from 'mongoose'
export interface ISwapEvent extends Document {
  transactionAddress: string
  timestamp: number
  blockNumber: number
  to: string
  sender: string
  amountUSD: string
  amountETH?: number
  amountMETIS?: number
  amount0In: number
  amount1In: number
  amount0Out: number
  amount1Out: number
  pairAddress: string
  pairLiquidityUSD: number
  pairLiquidityETH?: number
  pairLiquidityMETIS?: number
  token0Address: string
  token1Address: string
  token0Symbol: string
  token1Symbol: string
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

const SwapSchema = new mongoose.Schema<ISwapEvent>({
  transactionAddress: String,
  timestamp: Number,
  blockNumber: Number,
  to: String,
  sender: String,
  amountUSD: String,
  amountETH: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1
    },
  },
  amountMETIS: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1088
    },
  },
  amount0In: Number,
  amount1In: Number,
  amount0Out: Number,
  amount1Out: Number,
  pairAddress: String,
  pairLiquidityUSD: Number,
  pairLiquidityETH: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1
    },
  },
  pairLiquidityMETIS: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token0Address: String,
  token1Address: String,
  token0Symbol: String,
  token1Symbol: String,
  token0PriceUSD: Number,
  token1PriceUSD: Number,
  token0PriceETH: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1
    },
  },
  token0PriceMETIS: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1088
    },
  },
  token1PriceETH: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1
    },
  },
  token1PriceMETIS: {
    type: Number,
    required: function (this: ISwapEvent) {
      return parseInt(this.network) == 1088
    },
  },
  walletAddress: String,
  walletCategory: String,
  AMM: String,
  network: String,
})

const Swap = mongoose.model<ISwapEvent>('Swap', SwapSchema)

export default Swap
