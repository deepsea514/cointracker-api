import { Document } from 'mongoose'
import { EXCHANGES } from '../constants/constants'
import { getTokenByAddress, getTokenHistorical } from '../controllers/helpers/tokens'
import History, { IHistory } from '../models/historySchema'
import Token, { IToken } from '../models/tokenSchema'
import { ChainId } from './chain/chainConfiguration'

async function getNewestTokenHistory(dbToken: IToken & Document<any, any>): Promise<IHistory[]> {
  const tokenHistory = await History.find({ tokenId: dbToken.tokenId }).sort({ timestamp: 'desc' }).limit(1)
  if (!tokenHistory) return []
  let newest = tokenHistory?.[0]?.timestamp
  if (!newest) newest = new Date().getTime() / 1000 - 30 * 24 * 60 * 60
  console.log(
    `Newest history: ${Math.floor(
      (new Date().getTime() - new Date(newest * 1000).getTime()) / 60000,
    )} minutes old for ${dbToken.symbol} - ${dbToken.AMM}`,
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

  const MAX_RETRIES = 5
  for (const token of tokens) {
    console.log(`Updating Token Info: ${token.name}: ${token.address}`)
    let retries = 0
    let shouldRetry = false
    do {
      try {
        const upatedtokenInfo = await getTokenByAddress(
          Number(token.network) as ChainId,
          token.AMM as EXCHANGES,
          token.address,
          true,
        )

        if (upatedtokenInfo)
          await token.update({
            ...upatedtokenInfo,
            heliosprotect: upatedtokenInfo.heliosprotect ?? token.heliosprotect,
          })
      } catch (err: any) {
        shouldRetry = ++retries < MAX_RETRIES
      }
    } while (shouldRetry)

    console.log(`Updating Token History: ${token.name}: ${token.address}`)
    retries = 0
    shouldRetry = false
    do {
      try {
        const histories = await getNewestTokenHistory(token)
        shouldRetry = false
      } catch (err: any) {
        if (['InsufficientDataError', 'PairUnavailableError'].includes(err.name)) {
          shouldRetry = true
        } else {
          shouldRetry = ++retries < MAX_RETRIES
        }

        if (shouldRetry) {
          console.log(`Retrying to update ${token.id}: ${retries}/${MAX_RETRIES}`)
        } else {
          console.log(`Could not update ${token.id} because of ${err.name}\n${err.message}.`)
          break
        }
      }
    } while (shouldRetry)
  }

  console.log(`Update Time Elapsed: ${(new Date().getTime() - start) / 1000}s`)
}
