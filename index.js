const express = require('express');
const app = express();
const port = 3243;
const contentService = require('./content-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { addArticle } = require('./content-service'); // Importing addArticle function from content-service.js
const upload = multer(); // Multer setup for in-memory storage

cloudinary.config({
    cloud_name: 'da6xzuisj',
    api_key: '394617433335147',
    api_secret: 'Z7MyJPImINXOtvesAcLrO91TK0A',
    secure: true
});

app.set('json spaces', 2); // Enable pretty-printing with 2 spaces indentation

const path = require('path');

app.use(express.static('public'));

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
        const newArticle = await addArticle(req.body);
        res.redirect('/articles'); // Redirect to articles page after adding
    } catch (error) {
        console.error('Error processing article:', error);
        res.status(500).send('Error processing the article');
    }
});

// Initialize the content service
contentService.initialize().then(() => {
    // Route to get all articles (returns JSON)
    app.get('/articles', (req, res) => {
        contentService.getAllArticles()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    });

    // Route to get published articles (returns JSON)
    app.get('/published-articles', (req, res) => {
        contentService.getPublishedArticles()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    });

    // Route to get all categories (returns JSON)
    app.get('/categories', (req, res) => {
        contentService.getCategories()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    });
}).catch(err => {
    console.error("Error initializing content service: ", err);
});
