const fs = require('fs');

let articles = [];
let categories = [];

// Initialize by reading articles and categories from JSON files
function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/articles.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read articles file");
            } else {
                articles = JSON.parse(data);

                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject("Unable to read categories file");
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

// Get all articles
function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles found");
        }
    });
}

// Get published articles
function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        const publishedArticles = articles.filter(article => article.published);
        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        } else {
            reject("No published articles found");
        }
    });
}

// Get all categories
function getAllCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}
require('dotenv').config(); // Load environment variables

const { Pool } = require('pg');

const pool = new Pool({
    user: 'neondb_owner', 
    host: 'ep-round-king-a588mgw.us-east-2.aws.neon.tech', 
    database: 'neondb', 
    password: 'lmLnD7YHV6vp', 
    port: 5432, 
    ssl: { rejectUnauthorized: false }, 
});

module.exports = pool;

module.exports.getAllArticles = async () => {
    try {
        const res = await pool.query('SELECT * FROM articles');
        return res.rows;
    } catch (err) {
        throw new Error('Unable to fetch articles');
    }
};

// Fetch all categories
module.exports.getAllCategories = async () => {
    try {
        const res = await pool.query('SELECT * FROM categories');
        return res.rows;
    } catch (err) {
        throw new Error('Unable to fetch categories');
    }
};

// Add a new article
module.exports.addArticle = async (article) => {
    const { title, content, category_id, published, author, date } = article;
    try {
        await pool.query(
            'INSERT INTO articles (title, content, category_id, published, author, date) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, content, category_id, published, author, date]
        );
    } catch (err) {
        throw new Error('Unable to add article');
    }
};


// Get articles with category names included
function getArticlesWithCategoryNames() {
    return Promise.all([getAllArticles(), getAllCategories()])
        .then(([articles, categories]) => {
            return articles.map(article => {
                const category = categories.find(cat => cat.id === article.category);
                return {
                    ...article,
                    categoryName: category ? category.name : 'Unknown'
                };
            });
        });
}

// Add a new article
function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        // Set articleData.published to false if it's undefined, otherwise keep as true
        articleData.published = articleData.published !== undefined ? articleData.published : false;

        // Set the id of the articleData to the length of the articles array plus one
        articleData.id = articles.length + 1;

        // Push the updated articleData object to the articles array
        articles.push(articleData);

        // Resolve the promise with the newly added articleData
        resolve(articleData);
    });
    
}
// Get an article by its ID
function getArticleById(articleId) {
    return new Promise((resolve, reject) => {
        const article = articles.find(a => a.id == articleId); // Find article by ID
        if (article) {
            const category = categories.find(cat => cat.id === article.category);
            article.categoryName = category ? category.name : 'Unknown'; // Add category name
            resolve(article);
        } else {
            reject(`Article with ID ${articleId} not found`);
        }
    });
}


// Consolidated export of all functions
module.exports = {
    initialize,
    getAllArticles,
    getPublishedArticles,
    getAllCategories, 
    getArticlesWithCategoryNames,
    addArticle,
    getArticleById
};
