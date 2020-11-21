import { Request, Response } from 'express'
import { NextFunction } from "express"
import { QueryResult } from "pg"
import { pool } from "../database"
import { IDatabaseUser } from "../interfaces/UserInterface"

// Admin Middleware
export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req
    if (user) {
        pool.query('SELECT * FROM users WHERE id = $1', [user.id]).then((doc: QueryResult<IDatabaseUser>) => {
            if (doc.rows[0].isAdmin) {
                next()
            } else {
                return res.status(400).send({ message: 'You are not admin!'})
            }
        })
    } else {
        return res.status(400).send({ message: 'Permission denied!' })
    }
}