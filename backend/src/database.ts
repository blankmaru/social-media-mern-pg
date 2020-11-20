import { Pool } from 'pg'

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'geddoku',
    database: 'socialmediadb',
    port: 5432
})