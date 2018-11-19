const express = require('express');
const router = express.Router();
const controller = require('../controllers/parseController');
var { isAdmin } = require('../auth/authServices');

/**
 * @apiDefine admin Acesso permitido para admins
 * O acesso a esse endpoint é permitido apenas para usuários admin
 */

/**
 * @api {get} /parse-filmes Parsear Filmes
 * @apiGroup Parse
 * @apiPermission admin
 */

router.get('/parse-filmes', controller.getFilmes);

router.post('parse-filmes', controller.getFilme);

/**
 * @api {get} /parse-series Parsear Series
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parse-series', controller.getSeries);

/**
 * @api {get} /parse-series Parsear Temporadas
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parse-temporadas', controller.getTemporadas);

/**
 * @api {get} /parse-preparar Teste do parse
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parse-preparar', controller.getPreparar);

module.exports = router;