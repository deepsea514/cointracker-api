import { getOrSetCache } from '../cache/redis'
import Token, { IToken } from '../models/tokenSchema'

export const getTokenById = async (
  tokenId: string,
  from?: number,
  to?: number,
  months: number = 3,
): Promise<IToken | null> => {
  const token = await getOrSetCache(
    `websocket/${tokenId}`,
    async () => {
      return await Token.findOne({ tokenId }).populate({
        path: 'history',
        match: {
          timestamp: {
            $lte: Math.floor(to !== undefined ? to / 1000 : (new Date().getTime() / 1000) >> 0),
            $gte: from !== undefined ? from / 1000 : (new Date().getTime() / 1000 - months * 30 * 24 * 60 * 60) >> 0,
          },
        },
        options: { sort: { timestamp: 1 } },
      })
    },
    true,
    15,
  )
  // console.log(token)

  if (!token) return null

  return token
}

// export const getSlicedToken = (token: IToken, from?: number, to?: number, months: number = 3) => {
//   const slicedToken = extractTokenWithHistoryBetweenTimestamps(
//     token,
//     from ?? (new Date().getTime() / 1000 - months * 30 * 24 * 60 * 60) >> 0,
//     to ?? (new Date().getTime() / 1000) >> 0,
//   )
//   return slicedToken
// }

// export const extractTokenWithHistoryBetweenTimestamps = (token: IToken, from: number, to: number) => {
//   let toIndex = -1
//   let fromIndex = -1
//   const latestTime = token?.history[0]?.timestamp
//   const firstTime = token?.history[token?.history?.length - 1]?.timestamp
//   if (latestTime <= to) toIndex = 0
//   else toIndex = token?.history?.findIndex((history) => history?.timestamp <= to)
//   if (firstTime >= from) fromIndex = token?.history?.length - 1
//   else fromIndex = token?.history?.findIndex((history) => history?.timestamp <= from)
//   const existingHistoryLength = token?.history?.length
//   const slicedHistory = token?.history?.slice(toIndex, fromIndex + 1)
//   token.history = slicedHistory
//   //   console.log(
//   //     'toIndex:',
//   //     toIndex,
//   //     'fromIndex:',
//   //     fromIndex,
//   //     'latestHistory:',
//   //     new Date(latestTime * 1000).toLocaleDateString(),
//   //     'requestedUpto:',
//   //     new Date(to * 1000).toLocaleDateString(),
//   //     'earliestHistory:',
//   //     new Date(firstTime * 1000).toLocaleDateString(),
//   //     'requestedEarliest:',
//   //     new Date(from * 1000).toLocaleDateString(),
//   //     'slicedHistoryLength:',
//   //     slicedHistory.length,
//   //     'existingHistoryLength',
//   //     existingHistoryLength,
//   //   )
//   return token
// }
