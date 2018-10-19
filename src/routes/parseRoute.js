const express = require('express');
const router = express.Router();
const controller = require('../controllers/parseController')

router.get('/filmes', controller.getFilmes);
router.get('/series', controller.getSeries);
router.get('/preparar', controller.getPreparar);
router.post('/series', controller.getTemporadas);

module.exports = router;