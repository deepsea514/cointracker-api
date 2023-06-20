import { getTokenHistorical, getTokens } from '../controllers/helpers/tokens'
import { Document } from 'mongoose'
import { EXCHANGES, SUBGRAPHS } from '../constants/constants'
import Token, { IToken } from '../models/tokenSchema'
import History, { IHistory } from '../models/historySchema'

async function getNewestTokenHistory(dbToken: IToken & Document<any, any>): Promise<IHistory[]> {
  const tokenHistory = await History.find({ tokenId: dbToken.tokenId }).sort({ timestamp: 'desc' }).limit(1)
  if (!tokenHistory) return []
  let newest = tokenHistory?.[0]?.timestamp
  if (!newest) newest = new Date().getTime() / 1000 - 30 * 24 * 60 * 60
  console.log(
    `Newest history: ${Math.floor(
      (new Date().getTime() - new Date(newest * 1000).getTime()) / 60000,
    )} minutes old for ${dbToken.symbol}`,
  )

  const history = await getTokenHistorical(
    Number(dbToken?.network),
    dbToken?.AMM as EXCHANGES,
    60, // always retrieve 1 minute intervals
    dbToken?.address as string,
    newest * 1000,
    new Date().getTime(),
    false,
  )
  console.log(`Found ${history?.length} history for ${dbToken?.symbol}`)

  if (history.length == 0) {
    return tokenHistory
  }

  let result = await History.insertMany(history)

  // console.log(result)

  return result
}

export const CronJob = async (): Promise<void> => {
  const start = new Date().getTime()
  console.log('running a task every minute', new Date().toISOString())

  // Get all tokens & history
  // TODO: Future optimization: Every token looks up the chains NATIVE-STABLE pair on-chain
  // It should really just do this update first in the database, then they can all pull
  // the same info from there (much faster)
  // TODO: this will be a lot of data, cant we just get the most recent history item?
  // or maybe we want to update with separate tasks (per chain or per exchange?)
  const tokens = await Token.find()
  console.log(`Found ${tokens.length} tokens in the db.`)

  for (let i = 0; i < tokens.length; i++) {
    let retries = 0
    const MAX_RETRIES = 5
    let shouldRetry = false

    do {
      try {
        let history = await getNewestTokenHistory(tokens[i])
        console.log(history?.length)
      } catch (err: any) {
        shouldRetry =
          err.name !== 'InsufficientDataError' && err.name !== 'PairUnavailableError' ? ++retries < MAX_RETRIES : false

        if (shouldRetry) {
          console.log(`Retrying to update ${tokens[i].id}: ${retries}/${MAX_RETRIES}`)
        } else {
          console.log(`Could not update ${tokens[i].id} because of ${err.name}\n${err.message}.`)
          break
        }
      }
    } while (shouldRetry)
  }

  console.log(`Update Time Elapsed: ${(new Date().getTime() - start) / 1000}s`)
}
