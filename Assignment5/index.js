const express = require('express');
const app = express();
const port = 3243;
const contentService = require('./content-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { addArticle, getAllArticles, getAllCategories, getArticlesWithCategoryNames, getArticleById } = require('./content-service'); // Importing required functions
const upload = multer(); // Multer setup for in-memory storage
const path = require('path');

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'da6xzuisj',
    api_key: '394617433335147',
    api_secret: 'Z7MyJPImINXOtvesAcLrO91TK0A',
    secure: true
});

// Set up EJS templating engine and JSON formatting
app.set('view engine', 'ejs');
app.set('json spaces', 2);

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Redirect '/' to '/about'
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve 'about.html'
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to serve 'addArticle.html'
app.get('/articles/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
});

// Route to display all articles using EJS
app.get('/articles', async (req, res) => {
    try {
        const articles = await getArticlesWithCategoryNames();
        res.render('articles', { articles });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.render('articles', { articles: [] });
    }
});

// Route to display categories using EJS
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.render('categories', { categories: [] });
    }
});

// Route to display a specific article by ID using EJS
app.get('/article/:id', async (req, res) => {
    try {
        const article = await getArticleById(req.params.id);
        if (!article.published) {
            res.status(404).render('404');
        } else {
            res.render('article', { article });
        }
    } catch (err) {
        console.error('Error fetching article:', err);
        res.status(404).render('404');
    }
});

// POST route to handle image upload and add a new article
app.post('/article/add', upload.single("featureImage"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            // Handle image upload using Cloudinary
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const uploadResult = await streamUpload(req);
            imageUrl = uploadResult.url; // Get the URL of the uploaded image
        }

        // Add the image URL to the request body
        req.body.featureImage = imageUrl;

        // Call addArticle to add the new article
        await addArticle(req.body);
        res.redirect('/articles'); // Redirect to articles page after adding
    } catch (error) {
        console.error('Error processing article:', error);
        res.status(500).send('Error processing the article');
    }
});

// Initialize the content service and start the server
contentService.initialize().then(() => {
    // Route to get all articles as JSON
    app.get('/api/articles', async (req, res) => {
        try {
            const data = await getAllArticles();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Route to get published articles as JSON
    app.get('/api/published-articles', async (req, res) => {
        try {
            const data = await contentService.getPublishedArticles();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Route to get all categories as JSON
    app.get('/api/categories', async (req, res) => {
        try {
            const data = await getAllCategories();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    });
}).catch(err => {
    console.error("Error initializing content service: ", err);
});
