import mongoose from 'mongoose'

export const connect = () => {
  const user = process.env.DB_USER
  const pass = process.env.DB_PASS
  const host = process.env.DB_HOST
  const uri = `mongodb://${user}:${pass}@${host}` // connect to local mongodb for dev and docker service for production

  return mongoose
    .connect(uri)
    .then((conn) => {
      console.log(`DB connected`)
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2))

      throw new Error('Unable to connect to db')
    })
}
