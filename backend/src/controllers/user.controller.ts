import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import bcrypt from 'bcryptjs'

import { pool } from '../database'
import { IDatabaseUser } from '../interfaces/UserInterface'
import { logger } from '../log/logger'

export const getUsers = (req: Request, res: Response) => {
    res.send('users')
}

export const register = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { name, email, password} = req?.body
        if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid values'})
        }
    
        pool.query('SELECT * FROM users WHERE name = $1', [name]).then(async (doc: QueryResult<IDatabaseUser>) => {
            if (doc.rows[0]) return res.status(400).json({ message: 'User already registered'})
            if (!doc.rows[0]) {
                const hashedPassword = await bcrypt.hash(password, 10)
                const response: QueryResult = await pool.query('INSERT INTO users (name, password, email) VALUES ($1, $2, $3)', [name, hashedPassword, email])
                logger.info(`User ${name}, ${email}, password: ${hashedPassword} was created`)
                return res.status(200).json({ message: 'User successfully registered!'})
            }
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}