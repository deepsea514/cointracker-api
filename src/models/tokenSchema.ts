import mongoose, { Document } from 'mongoose'
import { isDataView } from 'util/types'
import History, { IHistory } from './historySchema'

export interface IToken {
  tokenId: string
  address: string
  symbol: string
  name: string
  history: IHistory[]
  description: string
  transactions24h: number
  transactions24hChange: number
  verified: boolean
  decimals: number
  volume24h: number
  volume24hUSD: number
  volume24hETH?: number
  // volume24hFTM?: number
  volume24hPLS?: number
  volume24hMNT?: number
  volume24hBNB?: number
  volumeChange24h: number
  liquidityUSD: number
  liquidityETH?: number
  // liquidityFTM?: number
  liquidityPLS?: number
  liquidityMNT?: number
  liquidityBNB?: number
  liquidityChange24h: number
  logoURI: string
  priceUSD: number
  priceETH?: number
  // priceFTM?: number
  pricePLS?: number
  priceMNT?: number
  priceBNB?: number
  priceChange24h: number
  priceUSDChange24h: number
  priceETHChange24h?: number
  // priceFTMChange24h?: number
  pricePLSChange24h?: number
  priceMNTChange24h?: number
  priceBNBChange24h?: number
  timestamp: number
  blockNumber: number
  AMM: string
  network: string
  history_length: number
  last_history: IHistory
}

const TokenSchema = new mongoose.Schema<IToken>(
  {
    tokenId: { type: String, index: true },
    address: String,
    symbol: String,
    name: String,
    // history: [
    //   {
    //     type: Object,
    //     select: false,
    //   },
    // ],
    description: String,
    transactions24h: Number,
    transactions24hChange: Number,
    verified: Boolean,
    decimals: Number,
    volume24h: Number,
    volume24hUSD: Number,
    volume24hETH: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1 || parseInt(this.network) == 8453
      },
    },
    volume24hBNB: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 56
      },
    },
    // volume24hFTM: {
    //   type: Number,
    //   required: function (this: IToken) {
    //     return parseInt(this.network) == 250
    //   },
    // },
    volume24hMNT: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 5000
      },
    },
    volume24hPLS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 369
      },
    },
    volumeChange24h: Number,
    liquidityUSD: Number,
    liquidityETH: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1 || parseInt(this.network) == 8453
      },
    },
    liquidityBNB: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 56
      },
    },
    // liquidityFTM: {
    //   type: Number,
    //   required: function (this: IToken) {
    //     return parseInt(this.network) == 250
    //   },
    // },
    liquidityMNT: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 5000
      },
    },
    liquidityPLS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 369
      },
    },
    liquidityChange24h: Number,
    logoURI: String,
    priceUSD: Number,
    priceETH: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1 || parseInt(this.network) == 8453
      },
    },
    priceBNB: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 56
      },
    },
    // priceFTM: {
    //   type: Number,
    //   required: function (this: IToken) {
    //     return parseInt(this.network) == 250
    //   },
    // },
    priceMNT: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 5000
      },
    },
    pricePLS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 369
      },
    },
    priceChange24h: Number,
    priceUSDChange24h: Number,
    priceETHChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1 || parseInt(this.network) == 8453
      },
    },
    priceBNBChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 56
      },
    },
    // priceFTMChange24h: {
    //   type: Number,
    //   required: function (this: IToken) {
    //     return parseInt(this.network) == 250
    //   },
    // },
    priceMNTChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 5000
      },
    },
    pricePLSChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 369
      },
    },
    timestamp: Number,
    blockNumber: Number,
    AMM: String,
    network: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, autoIndex: false },
)

TokenSchema.on('index', function (err) {
  console.log(`There was an error creating index on Token`)
})

TokenSchema.virtual('history', {
  ref: 'History',
  localField: 'tokenId',
  foreignField: 'tokenId',
  justOne: false,
})

TokenSchema.virtual('history_length').get(function (this: IToken) {
  return this.history?.length ?? 0
})

TokenSchema.virtual('last_history').get(function (this: IToken) {
  return this.history?.[0] ?? null
})

const Token = mongoose.model<IToken>('Token', TokenSchema)

export default Token
