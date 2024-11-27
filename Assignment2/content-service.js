const fs = require('fs');

let articles = [];
let categories = [];

// Initialize by reading articles and categories from JSON files
module.exports.initialize = function () {
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
};

// Get all articles
module.exports.getAllArticles = function () {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles found");
        }
    });
};

// Get published articles
module.exports.getPublishedArticles = function () {
    return new Promise((resolve, reject) => {
        const publishedArticles = articles.filter(article => article.published);
        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        } else {
            reject("No published articles found");
        }
    });
};

// Get all categories
module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
};
