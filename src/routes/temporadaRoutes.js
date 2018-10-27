const express = require('express');
const router = express.Router();
const temporadas = require('../controllers/temporadaController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/temporadas';

// Retrieve all Temporadas
router.get(prefix, temporadas.findAll);

// Retrieve a single Temporada with temporadaId
router.get(prefix+'/:serieId', temporadas.findOne);

// Verifica se usuario é admin
// Create a new Temporada
router.post('/temporadas', isAdmin, temporadas.create);

// Update a Temporada with temporadaId
//router.put(prefix+'/:temporadaId', isAdmin, temporadas.update);

// Delete a Temporada with temporadaId
router.delete(prefix+'/:temporadaId', isAdmin, temporadas.delete);

module.exports = router;