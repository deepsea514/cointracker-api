import mongoose, { Document } from 'mongoose'

export interface IHistory {
  AMM: string
  network: string
  tokenId: string
  high: number
  low: number
  open: number
  close: number
  volume: number
  timestamp: number
}

const HistorySchema = new mongoose.Schema<IHistory>(
  {
    tokenId: { type: String, index: true },
    high: String,
    low: String,
    open: String,
    close: String,
    volume: String,
    timestamp: String,
    AMM: String,
    network: String,
  },
  { autoIndex: false },
)

HistorySchema.on('index', function (err) {
  console.log(`There was an error ${JSON.stringify(err)}`)
})

const History = mongoose.model<IHistory>('History', HistorySchema)

export default History
