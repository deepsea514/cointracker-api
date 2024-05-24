import fs from 'fs'
import path from 'path'
import { CHAINS, EXCHANGES, SUBGRAPHS } from '../constants/constants'
import { getPairsByTokenFromSubgraph } from '../controllers/helpers/pairs'
import { getExchange, getTokenHistorical, getTokens } from '../controllers/helpers/tokens'
import History, { IHistory } from '../models/historySchema'
import Token, { IToken } from '../models/tokenSchema'
import { logAddresses, logFetchTokenError, logSubgraphError, logTime } from './logging'

export const fillDbWithTokens = async (ch: CHAINS, ex: EXCHANGES) => {
  if (!fs.existsSync(path.join(process.cwd(), '.logs'))) fs.mkdirSync(path.join(process.cwd(), '.logs'))
  // if (ch != CHAINS.FTM) return
  try {
    const subgraph = SUBGRAPHS[ch]?.[ex]
    if (!subgraph) {
      throw new Error(`Could not find subgraph for the provided Exchange Chain: ${ch} - Exchange: ${ex}`)
    }

    console.log(`Hitting ${ch} - ${ex}`)

    const MAX_RETRIES = 5
    let retries = 0
    let shouldRetry = false
    let fetchedTokens: any[] = []
    do {
      // Get top 100 tokens from graphql
      try {
        fetchedTokens = await getTokens(ch as CHAINS, ex as EXCHANGES, 10, false) // don't cache this request
        shouldRetry = false
      } catch (err: any) {
        shouldRetry = ++retries < MAX_RETRIES ? true : false

        if (shouldRetry) {
          console.log(`Failed to fetch tokens because ${err.name}-${err.message}, retry #${retries}`)
        } else {
          console.log(`Fetch token failed.`)
          break
        }
      }
    } while (shouldRetry)

    for (let i = 0; i < fetchedTokens.length; i++) {
      retries = 0
      shouldRetry = false
      do {
        try {
          await getPairsByTokenFromSubgraph(fetchedTokens[i]?.address, ch, ex)
          shouldRetry = false
        } catch (err: any) {
          shouldRetry = ++retries < MAX_RETRIES ? true : false

          if (shouldRetry) {
            console.log(`Failed to fetch pairs because ${err.name}-${err.message}, retry #${retries}`)
          } else {
            console.log(`Fetch pairs failed.`)
            break
          }
        }
      } while (shouldRetry)
    }

    // Cross check if they already exist in the database
    const existingInDB = await Token.find({ AMM: ex, address: { $in: fetchedTokens.map((t) => t.address) } })

    // console.log(fetchedTokens)

    console.log(`LEAN COUNT: ${fetchedTokens.length}\nDB COUNT: ${existingInDB.length}`)

    let fetchedTokensAddresses = fetchedTokens.reduce(
      (acc, token) => (acc += `"${token?.symbol}": "${token?.address}",\n`),
      '',
    )

    fetchedTokensAddresses = fetchedTokensAddresses.slice(0, fetchedTokensAddresses.length - 2) + '\n'
    logAddresses('fetchedTokens', fetchedTokensAddresses, ex)

    // Get all the tokens that are _not_ already in the database
    const newTokens = fetchedTokens.filter(
      (ft) => !existingInDB.map((et) => et.address.toLowerCase()).includes(ft.address.toLowerCase()),
    )

    let newTokensAddresses = newTokens.reduce((acc, token) => (acc += `"${token?.symbol}": "${token?.address}",\n`), '')
    newTokensAddresses = newTokensAddresses.slice(0, newTokensAddresses.length - 2) + '\n'
    logAddresses('newTokens', newTokensAddresses, ex)
    console.log('DONE PREPARING. >> SAVING TOKENS NOW')
    const months = 1
    const from = new Date().setMonth(new Date().getMonth() - months) // From some months ago (3 months)
    const to = new Date().getTime() // to now!

    for (let i = 0; i < newTokens.length; i++) {
      console.log(`Token #${i} of ${newTokens.length}`)

      retries = 0
      shouldRetry = false
      do {
        logTime(from, to)

        try {
          const tokenHistory = await fetchTokenHistory(newTokens[i], ch, ex, from, to)

          if (!tokenHistory) {
            console.log(
              `No token history found for ${newTokens[i].symbol} on ${ch} @ ${ex}, continuing to next token..`,
            )
            break
          }
          const token = await storeTokenHistory(newTokens[i], tokenHistory, ch, ex)
          console.log(token.symbol, token.history_length)
          shouldRetry = false
        } catch (err: any) {
          shouldRetry =
            err.name !== 'InsufficientDataError' && err.name !== 'PairUnavailableError'
              ? ++retries < MAX_RETRIES
              : false
          if (shouldRetry) {
            console.log(`retrying: ${retries}/${MAX_RETRIES} because ${err.message}`)
          } else {
            console.log(`Fetch token history failed because of ${err.name}.`)
            logFetchTokenError(err, newTokens[i], ex)
            break
          }
        }
      } while (shouldRetry)
    }
    console.log(`DONE SAVING TOKENS for ${ex}`)
  } catch (err: any) {
    logSubgraphError(err, ex)
  }
}

const fetchTokenHistory = async (
  token: IToken,
  ch: CHAINS,
  ex: EXCHANGES,
  from: number,
  to: number,
  resolution: number = 60,
) => {
  console.log(`${ch}/${ex}: Starting to fetch history for ${token.symbol}...`)

  return getTokenHistorical(ch as CHAINS, ex, resolution, token.address, from, to, false)
}

const storeTokenHistory = async (token: IToken, tokenHistory: IHistory[], ch: CHAINS, ex: EXCHANGES) => {
  console.log(`${ch}/${ex}: History (${tokenHistory.length}) found for ${token.symbol} on ${ch} @ ${ex}.`)

  // Sort history by timestamp
  const sortedHistory = tokenHistory.sort(function (x, y) {
    return y.timestamp - x.timestamp
  })
  const firstHistory = sortedHistory[0] ?? null
  const lastHistory = sortedHistory[sortedHistory.length - 1] ?? null

  if (!firstHistory || !lastHistory) console.log(`First and last history not found.`)
  else {
    console.log(
      `Token: ${token.address} - ${token.symbol}\nFirstHistory: ${JSON.stringify(firstHistory, null, 2)} @ ${new Date(
        firstHistory.timestamp * 1000,
      ).toLocaleString()}\nLastHistory: ${JSON.stringify(lastHistory, null, 2)} @ ${new Date(
        lastHistory.timestamp * 1000,
      ).toLocaleString()}\n`,
    )

    let result = await History.insertMany(sortedHistory)
    console.log(`Added: ${result.length} documents`)
  }

  return await Token.create({
    ...token,
    tokenId: `${token.address}_${getExchange(ex, ch)}`,
  })
}
