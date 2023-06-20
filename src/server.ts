import { Server } from 'socket.io'
import http from 'http'
import Token from './models/tokenSchema'
import { SUBGRAPHS, EXCHANGES, CHAINS } from './constants/constants'
import { getExchange } from './controllers/helpers/tokens'
import app from './app'
import { getTokenById } from './utils/token'

const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' }, path: '/websocket' })

const rooms: string[] = []

io.on('connection', async (socket) => {
  const address = socket.handshake['query']['token']
  const chainId = socket.handshake['query']['chainId']
  const exchange = socket.handshake['query']['exchange']
  if (!address || !chainId || !exchange) {
    socket.emit(
      'error',
      `Expect token, chainId, and exchange to be valid. Found chainId: ${chainId}, exchange: ${exchange}, and  token: ${address}`,
    )
  } else if (!SUBGRAPHS[`${chainId}`]?.[`${exchange}`]) {
    socket.emit(
      'error',
      `Invalid chain Configuration: No Configuration found for chain: ${chainId} and exchange: ${exchange}.`,
    )
  } else if (
    !(await Token.findOne({ id: `${address}_${getExchange(exchange as EXCHANGES, chainId as unknown as CHAINS)}` }))
  ) {
    socket.emit('error', `Invalid token requested: ${address}`)
  } else {
    const room = `${address}_${getExchange(exchange as EXCHANGES, chainId as unknown as CHAINS)}`
    if (!rooms.includes(room)) rooms.push(room)
    socket.join(room)
    socket.emit(
      `connected`,
      `Welcome to Casper DeFi API. You have subscribed to receieve price details for ${address} every 30 seconds.`,
    )
    const token = await getTokenById(room)
    if (!token) socket.emit('error', `Token with address: ${address} not found.`)
    else socket.emit('history', token)
    // console.log(rooms)
  }

  socket.on('connect_error', (err) => {
    console.log(`Socket ${socket.id} had a connect error: ${JSON.stringify(err)} `)
  })
  socket.on('connect_failed', (err) => {
    console.log(`Socket ${socket.id} had a connect failed error: ${JSON.stringify(err)} `)
  })

  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${JSON.stringify(reason)} `)
  })
})

setInterval(async () => {
  //   console.log(rooms)
  await Promise.all(
    rooms.map(async (room) => {
      const roomSize = io.sockets.adapter.rooms.get(room)?.size ?? 0
      if (roomSize == 0) {
        console.log(`No Clients in room ${room}, aborting.`)
      } else {
        console.log(`${roomSize} Clients in room ${room}, proceeding.`)
        const token = await getTokenById(room)
        if (!token) io.to(room).emit('error', `Token with address: ${room.split('_')[0]} not found.`)
        else io.to(room).emit('history', token)
      }
    }),
  )
}, 30_000)

export default server
