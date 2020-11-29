import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getUserFriends = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { id } = req?.params
        const response: QueryResult = await pool.query('SELECT friends FROM users WHERE id = $1', [id]) 
        logger.info('Friends: ', response.rows)
        return res.status(200).send(response.rows)
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const follow = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { name, user } = req?.body
        const response: QueryResult = await pool.query(`UPDATE users SET friends = array_cat(friends, $1) WHERE id = $2`, [name, user.id])
        logger.info(`Follow: ${name}`)
        return res.status(200).send({ success: true })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const unfollow = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { name, user } = req?.body
        const response: QueryResult = await pool.query(`UPDATE users SET friends = array_remove(friends, $1) WHERE id = $2`, [name, user.id])
        logger.info(`Unfollow: ${name}`)
        console.log({ success: true })
        return res.status(200).send({ success: true })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

// Admin Routes
export const deleteFriends = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { id } = req?.body
        const response: QueryResult = await pool.query(`UPDATE users SET friends = '{}' WHERE id = $1`, [id])
        return res.status(200).send({ success: true })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}