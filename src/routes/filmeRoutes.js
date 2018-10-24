const express = require('express');
const router = express.Router();
const filmes = require('../controllers/filmeController');

// Create a new Movie
router.post('/filmes', filmes.create);

// Retrieve all Movies
router.get('/filmes', filmes.findAll);

// Retrieve a single Movie with filmeId
router.get('/filmes/:filmeId', filmes.findOne);

// Update a Movie with filmeId
router.put('/filmes/:filmeId', filmes.update);

// Delete a Movie with filmeId
router.delete('/filmes/:filmeId', filmes.delete);

module.exports = router;