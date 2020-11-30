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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

import usersRoutes from './routes/user.routes'
import postsRoutes from './routes/post.routes'
import friendsRoutes from './routes/friend.routes'
import chatRoutes from './routes/chat.routes'
import reportRoutes from './routes/report.routes'

import { QueryResult } from 'pg'
import { pool } from './database'
import { IDatabaseUser } from './interfaces/UserInterface'
import { IMessage } from '../client/src/interfaces/interfaces'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
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


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
})
   
const upload = multer({ storage: storage }).single("file")
  
app.post("/api/files/uploadfiles", (req, res) => {
    upload(req, res, (err: any) => {
      if(err) {
        return res.json({ success: false, err })
      }
      return res.json({ success: true, url: res.req?.file.path });
    })
});

io.on('connect', (socket: any) => {
    socket.on('join', ({ name, room }: { name: string, room: string}, callback: Function) => {
        const { error, user } = addUser({ id: socket.id, name, room });
    
        if(error) return callback(error);
    
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
      });

      socket.on('sendMessage', (message: IMessage, callback: Function) => {
        const user = getUser(socket.id);
    
        io.to(user.room).emit('message', { user: user.name, text: message });
    
        callback();
      });
    
      socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    
        if(user) {
          io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
      })
});
 
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
app.use('/api/chats', chatRoutes)
app.use('/api/reports', reportRoutes)

app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});