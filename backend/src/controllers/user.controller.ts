import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getUsers = (req: Request, res: Response) => {
    res.send('users')
}