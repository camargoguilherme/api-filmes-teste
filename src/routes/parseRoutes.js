const express = require('express');
const router = express.Router();
const controller = require('../controllers/parseController');
var { isAdmin } = require('../auth/authServices');

router.get('/parse-filmes', controller.getFilmes);
router.post('parse-filmes', controller.getFilme);

router.get('/parse-series', controller.getSeries);
router.post('/parse-series', controller.getTemporadas);
router.get('/parse-preparar', controller.getPreparar);

module.exports = router;