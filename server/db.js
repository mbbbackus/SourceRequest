import pg from 'pg';
const {Pool} = pg;

export const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: 'sourcetrackerapp'
})