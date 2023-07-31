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
  amountETH?: number
  amountPLS?: number
  amountMNT?: number
  amountBNB?: number
  pairLiquidityUSD: number
  pairLiquidityETH?: number
  pairLiquidityPLS?: number
  pairLiquidityMNT?: number
  pairLiquidityBNB?: number
  token0PriceUSD: number
  token1PriceUSD: number
  token0PriceETH?: number
  token1PriceETH?: number
  // amountFTM?: number
  // pairLiquidityFTM?: number
  // token0PriceFTM?: number
  // token1PriceFTM?: number
  token0PricePLS?: number
  token1PricePLS?: number
  token0PriceMNT?: number
  token1PriceMNT?: number
  token0PriceBNB?: number
  token1PriceBNB?: number
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
  amountETH: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1
    },
  },
  amountBNB: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 56
    },
  },
  // amountFTM: {
  //   type: Number,
  //   required: function (this: IMintEvent) {
  //     return parseInt(this.network) == 250
  //   },
  // },
  amountPLS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 369
    },
  },
  amountMNT: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 5000
    },
  },
  pairLiquidityUSD: Number,
  pairLiquidityETH: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1
    },
  },
  pairLiquidityBNB: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 56
    },
  },
  // pairLiquidityFTM: {
  //   type: Number,
  //   required: function (this: IMintEvent) {
  //     return parseInt(this.network) == 250
  //   },
  // },
  pairLiquidityPLS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 369
    },
  },
  pairLiquidityMNT: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 5000
    },
  },
  token0PriceUSD: Number,
  token0PriceETH: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1
    },
  },
  token0PriceBNB: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 56
    },
  },
  // token0PriceFTM: {
  //   type: Number,
  //   required: function (this: IMintEvent) {
  //     return parseInt(this.network) == 250
  //   },
  // },
  token0PricePLS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 369
    },
  },
  token0PriceMNT: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 5000
    },
  },
  token1PriceUSD: Number,
  token1PriceETH: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 1
    },
  },
  token1PriceBNB: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 56
    },
  },
  // token1PriceFTM: {
  //   type: Number,
  //   required: function (this: IMintEvent) {
  //     return parseInt(this.network) == 250
  //   },
  // },
  token1PricePLS: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 369
    },
  },
  token1PriceMNT: {
    type: Number,
    required: function (this: IMintEvent) {
      return parseInt(this.network) == 5000
    },
  },
  walletAddress: String,
  walletCategory: String,
  AMM: String,
  network: String,
})

const Mint = mongoose.model<IMintEvent>('Mint', MintSchema)

export default Mint
