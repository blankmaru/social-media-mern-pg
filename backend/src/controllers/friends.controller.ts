import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const follow = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { friend, user } = req?.body
        const response: QueryResult = await pool.query('UPDATE users SET friends = (friends, $1) WHERE id = $2', [friend.username, user.id])
        console.log(friend, user)
        logger.info(`Follow: ${friend}`)
        return res.status(200).send({ success: true })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}