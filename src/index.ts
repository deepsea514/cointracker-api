import 'dotenv/config'
import { CHAINS, EXCHANGES } from './constants/constants'
import { connect } from './db/connect'
import History from './models/historySchema'
import Pair from './models/pairSchema'
import Token from './models/tokenSchema'
import server from './server'
import { CronJob } from './utils/cron'
import { fillDbWithTokens } from './utils/fillDb'

const PORT = process.env.PORT || 3000

server.listen(PORT, async () => {
  console.log(`Server started on: http://localhost:${PORT}`)
  // Connect to database and run cron every 60 seconds (lower if required)
  connect().then(async () => {
    ensureDBIndexesExist()
    console.log(`${new Date().toISOString()}: Start filling tokens to the DB.`)
    // TODO: add dexes

    for (const exchange of [EXCHANGES.UNISWAP_V2, EXCHANGES.UNISWAP_V3]) {
      try {
        console.log(`${new Date().toISOString()}: Starting backfill for ${exchange.toUpperCase()}`)
        await fillDbWithTokens(CHAINS.ETH, exchange)
      } catch {
        console.log(`${new Date().toISOString()}: Failed to complete ${exchange.toUpperCase()}`)
      } finally {
        console.log(`${new Date().toISOString()}: Completed ${exchange.toUpperCase()} successfully`)
      }
    }

    // for (const exchange of [EXCHANGES.HERCULES_V2]) {
    //   try {
    //     console.log(`${new Date().toISOString()}: Starting backfill for ${exchange.toUpperCase()}`)
    //     await fillDbWithTokens(CHAINS.METIS, exchange)
    //   } catch {
    //     console.log(`${new Date().toISOString()}: Failed to complete ${exchange.toUpperCase()}`)
    //   } finally {
    //     console.log(`${new Date().toISOString()}: Completed ${exchange.toUpperCase()} successfully`)
    //   }
    // }

    console.log(`${new Date().toISOString()}: STARTING CRON AFTER BACKFILL`)
    // cron.schedule('*/2 * * * *', CronJob)

    // Keep it running forever!
    while (true) {
      await CronJob()
    }
  })
})

const ensureDBIndexesExist = () => {
  History.ensureIndexes((err) => {
    if (err) console.log(err)
  })

  Token.ensureIndexes((err) => {
    if (err) console.log(err)
  })
  Pair.ensureIndexes((err) => {
    if (err) console.log(err)
  })
}
