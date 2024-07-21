import express from 'express';
import cors from 'cors';
import {
    listArticles,
    getArticle,
    postArticle
} from './queries.js';
import { getSources } from './scrapers.js';

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

/**
 * Article GET
 * Endpoint for retrieving data about a specific article
 * @param {string} url - Article address we want to retrieve data from 
 * @returns {object} 
 *  @key title @value {string} Article title
 *  @key sources @value {Array} list of objects containing source data
 *    @key sentence @value {string} sentence in which source was cited
 *    @key url @value {string} url of source 
 */
app.get("/article/:url", async (request, response, next) => {
    try {
        // Check DB first so we don't scrape articles that have already been scraped
        const url = request.params.url;
        
        // TODO: Currently commented out the parts that connect to the database
        // so that I can focus on frontend dev

        // const article = await getArticle(url);
        // if (article.rows.length) {
        //     response.json(article.rows[0]);
        //     return;
        // }

        // Scrape article if this is our first time seeing it
        const sources = await getSources(url, true);
        response.json(sources);

        // Add article to database for future reference
        // await postArticle(url, sources);

    } catch (error) {
        console.error('Error processing request:', error);
        response.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

/**
 * Article LIST
 * Endpoint for retrieving a list of all articles in Database
 * @returns {Array} - all rows of Article table
 */
app.get("/articles", async (request, response, next) => {
    try {
        const url = request.params.url;
        const articles = await listArticles(url);
        if (articles.rows.length) {
            response.json(articles.rows);
        }
    } catch (error) {
        console.error('Could not list articles.', error)
    }
});

/**
 * Article POST
 * Endpoint for adding an article to the Database
 * @param {string} url - address of article
 * @param {string} title - title of article
 */
app.post('/article', async (request, response, next) =>{
    const {url, title} = request.body
    try {
        const posted = await postArticle(url, title);
        if (posted.rows.length) {
            response.json(articles.rows);
        }
    } catch (err){
        console.error(err)
    }
});
