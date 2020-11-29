import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getChats = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM chats')
        logger.info('Chats: ', response.rows)
        return res.status(200).send(response.rows)
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const createChat = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { title, url } = req?.body
        const response: QueryResult = await pool.query('INSERT INTO chats (title, url) VALUES ($1, $2)', [title, url])
        return res.status(200).send({ success: true })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}