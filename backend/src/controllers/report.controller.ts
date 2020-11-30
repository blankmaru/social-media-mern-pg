import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getReports = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM report')
        logger.info('Reports: ', response.rows)
        return res.status(200).send(response.rows)
    } catch(err) {
        logger.error({ error: err })
        console.log({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const addReport = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { info } = req?.body
        if (!info) {
            return res.status(400).send({ success: false })
        }
        const response: QueryResult = await pool.query('INSERT INTO report (info) VALUES ($1)', [info])
        logger.info(`Report added`)
        return res.status(200).send({ message: 'Report successfully turned!', success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}
