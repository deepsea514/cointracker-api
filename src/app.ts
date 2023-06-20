import express from 'express'
import indexRouter from './routes/index'
import errorHandler from './middleware/errorHandler'
import pageNotFoundHandler from './middleware/pageNotFoundHandler'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

// Allow all Cors
// TODO: Update to be specific
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/', indexRouter)
app.use('*', pageNotFoundHandler)
app.use(errorHandler)

export default app
