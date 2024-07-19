const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/article', async (req, res) => {
    try{
        const article = await pool.query('SELECT * FROM article')
        res.json(article.rows)
    } catch (err) {
        console.error(error)
    }
})

app.get('/url/:encodedURI', async (req, res) => {
    const url = decodeURIComponent(req.params.encodedURI)
    try{
        const nodes = await pool.query(`SELECT * FROM article WHERE url = $1`, [url])
        res.json(nodes.rows)
    }catch (err){
        console.error(err)
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