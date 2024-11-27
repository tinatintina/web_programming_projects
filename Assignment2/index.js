const express = require('express');
const app = express();
const port = 3243;
const contentService = require('./content-service');

app.set('json spaces', 2);  // This enables pretty-printing with 2 spaces indentation


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Redirect '/' to '/about'
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve 'about.html'
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

// Initialize the content service and get articles and categories
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
