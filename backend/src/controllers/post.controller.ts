import { Request, Response } from 'express'
import { QueryResult } from 'pg'

import { pool } from '../database'
import { logger } from '../log/logger'

export const getPosts = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const response: QueryResult = await pool.query('SELECT * FROM posts')
        logger.info(`Posts: `, response.rows)
        return res.status(200).send(response.rows)
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const addPost = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { title, content, author } = req?.body
        if (!title || !content || !author) {
            return res.status(400).send({ success: false })
        }
        const response: QueryResult = await pool.query('INSERT INTO posts (title, content, author) VALUES ($1, $2, $3)', [title, content, author])
        logger.info(`Post ${title} added`)
        return res.status(200).send({ message: 'Post successfully added!', success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const updatePost = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const id = parseInt(req.params.id)
        const { title, content } = req?.body
        const response: QueryResult = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3', [title, content, id])
        logger.info(`Post ${id} updated`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const deletePost = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const id = parseInt(req.params.id)
        const response: QueryResult = await pool.query('DELETE FROM posts WHERE id = $1', [id])
        logger.info(`Post ${id} was deleted`)
        return res.status(200).json({ success: true })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}