const express = require('express');
const router = express.Router();
const series = require('../controllers/serieController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/series';

//Rotas antes da verificação para que usuario nao admin possam acessar
// Retrieve all Series
router.get(prefix, series.findAll);

// Retrieve a single Serie with serieId
router.get(prefix+'/:serieId', series.findOne);

// Verifica se o usuario é admin
// Create a new Serie
router.post(prefix, isAdmin, series.create);

// Update a Serie with serieId
router.put(prefix+'/:serieId', isAdmin, series.update);

// Delete a Serie with serieId
router.delete(prefix+'/:serieId', isAdmin, series.delete);

module.exports = router;