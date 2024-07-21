import { pool } from './db.js';

/**
 * Error handling wrapper for queries
 * @param {function} runQuery - queries database
 * @param {string} msg - error message context
 */
const handleQuery = async (runQuery, msg) => {
    try {
        return await runQuery();
    } catch (err) {
        console.error(msg, err)
    }
}

const listArticles = async () => {
    const q = `SELECT * FROM article`;
    const runQuery = () => pool.query(q);
    const msg =  'Could not list articles.';
    return await handleQuery(runQuery, msg);
}

const getArticle = async (url) => {
    const q = `SELECT * FROM article WHERE url = $1`;
    console.log(q)
    const runQuery = () => pool.query(q, [url]);
    const msg =  `Could not get article: ${url}`;
    return await handleQuery(runQuery, msg);
}

// For future reference - If title is null, that means it hasn't been scraped yet

const postArticle = async (url, sources) => {
    const addQ = `INSERT INTO article (url, title) VALUES ($1, $2) RETURNING id;`;
    const addArticleMsg =  `Could not add article to database: ${url}`;
    let newId = '';
    const runAddArticleQuery = () => pool.query(addQ, [url, title], (error, result) => {
        if (error) {
            console.log(addArticleMsg, error);
        } else {
            newId = result.rows[0].id;
        }
    });
    await handleQuery(runAddArticleQuery, addArticleMsg);

    // const queryParams = [newId];
    // const q = sources.map((source, index) => {
    //     const i = index + 2; // sql starts counting at 1
    //     queryParams.push(source.sentence);
    //     return `INSERT INTO citation (article, sentence) VALUES ($1,$${i});`;
    // }).join('');
    // const runQuery = () => pool.query(q, [url, title]);
    // const msg =  `Could not post article: ${url}`;
    // return await handleQuery(runQuery, msg);
}

export {
    listArticles,
    getArticle,
    postArticle
}