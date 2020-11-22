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
app.use(express.urlencoded({ extended: false }))
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

passport.use('local', new LocalStrategy( async (username: string, password: string, done) => {
    console.log(username + ' ' + password)
    await pool.query('SELECT * FROM users WHERE username = $1', [username]).then((res: QueryResult<IDatabaseUser>) => {
        const user = res.rows[0]
        if (!user) return done(null, false)
        bcrypt.compare(password, user.password, (err: Error, result: Boolean) => {
            if (err) throw err
            if (result === true) {
                return done(null, { id: user.id, username: user.username, isAdmin: user.isAdmin })
            } else {
                return done(null, false)
            }
        })
    })
}))

passport.serializeUser((user: IDatabaseUser, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async (id: string, cb) => {
    pool.query('SELECT id, username, isAdmin FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
        if(err) {
          logger.error('Error when selecting user on session deserialize', err)
          return cb(err)
        }
    
        cb(null, results.rows[0])
      })
})

app.use('/api/users', usersRoutes)

app.listen(5000, () => {
    logger.info('Server is running')
    console.log('Server is running')
})