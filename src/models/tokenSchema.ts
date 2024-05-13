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
  volume24hMETIS?: number
  volumeChange24h: number
  liquidityUSD: number
  liquidityETH?: number
  liquidityMETIS?: number
  liquidityChange24h: number
  logoURI: string
  priceUSD: number
  priceETH?: number
  priceMETIS?: number
  priceChange24h: number
  priceUSDChange24h: number
  priceETHChange24h?: number
  priceMETISChange24h?: number
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
        return parseInt(this.network) == 1088
      },
    },
    volume24hMETIS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    volumeChange24h: Number,
    liquidityUSD: Number,
    liquidityETH: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    liquidityMETIS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    liquidityChange24h: Number,
    logoURI: String,
    priceUSD: Number,
    priceETH: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    priceMETIS: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    priceChange24h: Number,
    priceUSDChange24h: Number,
    priceETHChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
      },
    },
    priceMETISChange24h: {
      type: Number,
      required: function (this: IToken) {
        return parseInt(this.network) == 1088
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
