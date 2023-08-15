import fs from 'fs'
import { EXCHANGES } from '../constants/constants'
import { IToken } from '../models/tokenSchema'

export const logTime = (from: number, to: number) => {
  fs.writeFile(
    `./.logs/time.json`,
    `{ "From": "${new Date(from).toISOString()}", "to": "${new Date(to).toISOString()}" }`,
    { flag: 'w+' },
    (err) => {
      if (err) console.log(`Error writing to time file! ${err?.message}`)
    },
  )
}

export const logFetchTokenError = (err: unknown, token: IToken, ex: EXCHANGES) => {
  console.log(err)
  console.log(`${ex.toUpperCase()}: Could not find historical data for token ${token.symbol} - ${token.address}`)
  fs.writeFile(
    `./.logs/errors_${ex}_${token.symbol}_${token.address}.json`,
    `{ "${new Date().toLocaleDateString()}":"${JSON.stringify(err)}"}`,
    { flag: 'w+' },
    (err) => {
      if (err) console.log(`Error writing to errors file! ${err?.message}`)
    },
  )
}

export const logSubgraphError = (err: unknown, ex: EXCHANGES) => {
  console.log(`${ex} had error`)
  console.log(err)
  return fs.writeFile(
    `./.logs/errors_${ex}.json`,
    `{ "${new Date().toLocaleDateString()}": ${JSON.stringify(err)}}`,
    { flag: 'w+' },
    (err) => {
      if (err) console.log(`Error writing to errors file! ${err?.message}`)
    },
  )
}

export const logAddresses = (type: string, addresses: string[], ex: EXCHANGES) => {
  return fs.writeFile(`./.logs/${type}_${ex}.json`, `{\n${addresses}}`, { flag: 'w+' }, (err) => {
    if (err) console.log(`Error writing to ./.logs/${type}_${ex}.json file! ${err?.message}`)
  })
}
