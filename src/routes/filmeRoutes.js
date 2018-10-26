const express = require('express');
const router = express.Router();
const filmes = require('../controllers/filmeController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/filmes'

// Retrieve all Movies
router.get(prefix, filmes.findAll);

// Retrieve a single Movie with filmeId
router.get(prefix+'/:filmeId', filmes.findOne);

// Create a new Movie
router.post(prefix, isAdmin, filmes.create);

// Update a Movie with filmeId
router.put(prefix+'/:filmeId', isAdmin, filmes.update);

// Delete a Movie with filmeId
router.delete(prefix+'/:filmeId', isAdmin, filmes.delete);

module.exports = router;