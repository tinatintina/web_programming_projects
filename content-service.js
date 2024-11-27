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
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}

// Add a new article
function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        // Set articleData.published to false if it's undefined, otherwise keep as true
        articleData.published = articleData.published !== undefined ? true : false;

        // Set the id of the articleData to the length of the articles array plus one
        articleData.id = articles.length + 1;

        // Push the updated articleData object to the articles array
        articles.push(articleData);

        // Resolve the promise with the newly added articleData
        resolve(articleData);
    });
}

// Consolidated export of all functions
module.exports = {
    initialize,
    getAllArticles,
    getPublishedArticles,
    getCategories,
    addArticle
};
