import express from 'express';
import axios from 'axios'
import cors from 'cors';
import { parse } from 'node-html-parser';
import { pool } from './db.js';

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

app.get('/article', async (req, res) => {
    try{
        const article = await pool.query('SELECT * FROM article')
        res.json(article.rows)
    } catch (err) {
        console.error(err)
    }
})

app.get("/article/:url", async (request, response, next) => {
    try {
        const url = request.params.url;
        const sources = await getSources(url, false);
        response.json(sources);
      } catch (error) {
        console.error('Error processing request:', error);
        response.status(500).json({ error: 'An error occurred while processing your request' });
      }
})

const getSources = async (url, ignoreCycles) => {
    const sources = [];
    let title = ''
    await axios.get(url).then((response) => {
        const root = parse(response.data);
        const domainName = (new URL(url)).hostname;
        const paragraphs = root.querySelectorAll('p');
        title = root.querySelector('title').text;
    
        const links = [];
        paragraphs.forEach(p => {
            const paragraph = p.text.trim();
            const sentences = paragraph.split('. ');
            const anchors = p.querySelectorAll('a');
            for (let a of anchors) {
                let sentence = paragraph;
                const link_text = a.text?.trim();
                const link_url = a.getAttribute('href');
                if (!link_text || !link_url) { // skip blank anchors
                    continue;
                }
                if (!link_url.includes('https://')) { // skip internal routes
                    continue;
                }
                if (ignoreCycles && link_url.includes(domainName)) { // skip links to same site
                    continue;
                }

                for (let s of sentences) {
                    if (s.includes(link_text)) {
                        sentence = s.trim();
                    }
                }

                links.push({
                    sentence,
                    url: a.getAttribute('href')
                })
            }
        })
        for (let link of links) {
            sources.push(link)
        }
    })
    return {title, sources};
}


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
