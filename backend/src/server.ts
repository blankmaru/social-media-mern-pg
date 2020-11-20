import express from 'express'
import { logger } from './log/logger'
const app = express()

import usersRoutes from './routes/user.routes'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(usersRoutes)

app.listen(5000, () => {
    logger.info('Server is running')
    console.log('Server is running')
})