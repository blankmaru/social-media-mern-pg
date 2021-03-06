import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import bcrypt from 'bcryptjs'

import { pool } from '../database'
import { IDatabaseUser } from '../interfaces/UserInterface'
import { logger } from '../log/logger'

// Auth
export const register = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { username, email, password, friends, posts, phone, address, bio } = req?.body
        if (!username || !email || !password || typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid values'})
        }
    
        pool.query('SELECT * FROM users WHERE username = $1', [username]).then(async (doc: QueryResult<IDatabaseUser>) => {
            if (doc.rows[0]) return res.status(400).json({ message: 'User already registered'})
            if (!doc.rows[0]) {
                const hashedPassword = await bcrypt.hash(password, 10)
                const response: QueryResult 
                = await pool.query('INSERT INTO users (username, password, email, friends, posts, phone, address, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [username, hashedPassword, email, friends, posts, phone, address, bio])
                console.log('Registered: ', true)
                logger.info(`User ${username}, ${email}, password: ${hashedPassword} was created`)
                return res.status(200).json({ message: 'User successfully registered!', success: true })
            }
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const login = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        logger.info('User login is success')
        return res.status(200).json({ auth: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const user = async (req: Request, res: Response): Promise<Response | undefined> => {
    logger.info({ user: req.user, message: 'Get user' })
    return res.send(req.user)
}

export const logOut = async (req: Request, res: Response): Promise<Response | undefined> => {
    req.logOut()
    logger.info('User logOut', { success: true })
    return res.status(200).json({ success: true })
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM users')
        logger.info(`Users from DB: ${JSON.stringify(response.rows)}`)
        return res.status(200).json(response.rows)
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const username = req.params.username
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        logger.info(`Users from DB: ${JSON.stringify(response.rows)}`)
        return res.status(200).json(response.rows)
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const updateUserInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id)
        const { phone, address, bio } = req?.body
        
        const response: QueryResult = await pool.query('UPDATE users SET phone = $1, address = $2, bio = $3 WHERE id = $4', [phone, address, bio, id])
        logger.info(`User Updated successfully`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const uploadAvatar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id)
        const { image } = req?.body

        const response: QueryResult = await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [image, id])
        logger.info(`User Avatar Updated successfully`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const uploadBg = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id)
        const { image } = req?.body

        const response: QueryResult = await pool.query('UPDATE users SET bgCover = $1 WHERE id = $2', [image, id])
        logger.info(`User Bg Updated successfully`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const setSocialAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id)
        const { instagram, facebook, google } = req?.body
        const sm: Array<object> = [{"instagram": instagram}, {"facebook": facebook}, {"google": google}]

        const response: QueryResult = await pool.query('UPDATE users SET smAccounts = $1 WHERE id = $2', [sm, id])
        logger.info(`User accounts upd successfully`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

// Func for Admin
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id)
        const response: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id])
        logger.info(`User ${id} was deleted`)
        return res.status(200).json({ message: 'User deleted'})
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}
