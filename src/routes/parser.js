  const express = require('express');
const router = express.Router();
const parserController = require('../controllers/parserController');
var { isAdmin } = require('../auth/authServices');

/**
 * @apiDefine admin Acesso permitido para admins
 * O acesso a esse endpoint é permitido apenas para usuários admin
 */

/**
 * @api {get} /parser/filmes Parsear Filmes
 * @apiGroup Parser
 * @apiPermission admin
 */

router.get('/parser/filmes', parserController.filmes);

/**
 * @api {get} /parse/series Parsear Series
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parser/series', parserController.series);

/**
 * @api {get} /parse/series Parsear Temporadas
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parser/temporadas');

/**
 * @api {get} /parse/preparar Teste do parse
 * @apiGroup Parse
 * @apiPermission admin
 */
router.get('/parser/preparar');

module.exports = router;