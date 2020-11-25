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
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "https://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
});

import usersRoutes from './routes/user.routes'
import postsRoutes from './routes/post.routes'
import friendsRoutes from './routes/friend.routes'

import { QueryResult } from 'pg'
import { pool } from './database'
import { IDatabaseUser, IUser } from './interfaces/UserInterface'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.options('*', cors());
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
                return done(null, { 
                    id: user.id, 
                    username: user.username, 
                    isAdmin: user.isAdmin,
                    email: user.email,
                    friends: user.friends,
                    posts: user.posts
                })
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
    pool.query('SELECT id, username, isAdmin, email, friends, posts FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
        if(err) {
          logger.error('Error when selecting user on session deserialize', err)
          return cb(err)
        }
    
        cb(null, results.rows[0])
      })
})

app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/friends', friendsRoutes)

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});