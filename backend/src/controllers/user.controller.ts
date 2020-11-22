import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import bcrypt from 'bcryptjs'

import { pool } from '../database'
import { IDatabaseUser } from '../interfaces/UserInterface'
import { logger } from '../log/logger'

// Auth
export const register = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { username, email, password} = req?.body
        if (!username || !email || !password || typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid values'})
        }
    
        pool.query('SELECT * FROM users WHERE username = $1', [username]).then(async (doc: QueryResult<IDatabaseUser>) => {
            if (doc.rows[0]) return res.status(400).json({ message: 'User already registered'})
            if (!doc.rows[0]) {
                const hashedPassword = await bcrypt.hash(password, 10)
                const response: QueryResult = await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email])
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

// Func for Admin
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
