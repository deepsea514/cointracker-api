import mongoose from 'mongoose'

export const connect = () => {
  const uri = `mongodb+srv://aurora:91I3vbqrXRHMFJCD@cluster0.wpw1ms6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` // connect to local mongodb for dev and docker service for production
  mongoose.set('strictQuery', true)
  return mongoose.connect(uri).then(
    () => {
      console.log('Database connection established!')
    },
    (err) => {
      {
        console.log('Error connecting Database instance due to:', err)
      }
    },
  )
}
