import express from 'express'
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bcrypt from 'bcryptjs'

const LocalStrategy = passportLocal.Strategy

import { logger } from './log/logger'
const app = express()

import usersRoutes from './routes/user.routes'
import { QueryResult } from 'pg'
import { pool } from './database'
import { IDatabaseUser, IUser } from './interfaces/UserInterface'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    })
)
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy( async (name: string, password: string, done) => {
    const response: QueryResult<IDatabaseUser> = await pool.query('SELECT * FROM users WHERE name = $1', [name])
    const user = response.rows[0]
    if (!user) return done(null, false)
    bcrypt.compare(password, user.password, (err: Error, result: Boolean) => {
        if (err) throw err
        if (result === true) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
}))

passport.serializeUser((user: IDatabaseUser, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async (id: string, cb) => {
    const response: QueryResult<IDatabaseUser> = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    const user = response.rows[0]
    if (user) {
        const userInfo: IUser = {
            username: user.username,
            isAdmin: user.isAdmin,
            id: user.id
        }
        cb({error: Error}, userInfo)
    }
})

app.use('/api/users', usersRoutes)

app.listen(5000, () => {
    logger.info('Server is running')
    console.log('Server is running')
})