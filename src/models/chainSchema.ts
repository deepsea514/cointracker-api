import mongoose from 'mongoose'

export interface IChain {
  _id: string
  name: string
  symbol: string
  chainId: number
}

const ChainSchema = new mongoose.Schema<IChain>({
  name: String,
  symbol: String,
  chainId: Number,
})

const Chain = mongoose.model<IChain>('Chain', ChainSchema)

export default Chain
