const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Welcome to TestApp',
    message: 'Hello from Express.js with EJS!'
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About TestApp',
    description: 'A Node.js application following MVC architecture'
  });
});

module.exports = router;