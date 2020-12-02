import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { IUser } from '../../client/src/interfaces/interfaces'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getPeoples = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM users')
        // const filtered: Array<IUser> = response.rows.filter((item: IUser) => item.posts.length > 0)
        // filtered.sort(function (a, b) {
        //     return a.posts.length - b.posts.length;
        // });
        // console.log({sorted: filtered})
        
        logger.info('Users: ', response.rows)
        return res.status(200).send(response.rows)
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const getImages = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const response: QueryResult = await pool.query('SELECT image FROM posts')
        return res.status(200).send({ images: response.rows })
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}