const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')

app.use(cors())

app.get('/article', async (req, res) => {
    try{
        const article = await pool.query('SELECT * FROM article')
        res.json(article.rows)
    } catch (err) {
        console.error(error)
    }
})

app.post('/article', (req, res) =>{
    const {url, title} = req.body
    try {
        pool.query(`INSERT INTO article (url, title)
                    VALUES ($1, $2);
                    `, [url, title])
    } catch (err){
        console.error(err)
    }
})

app.listen(PORT, () => console.log(PORT))