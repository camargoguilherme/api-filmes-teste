const express = require('express');
const router = express.Router();
const series = require('../controllers/serieController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/series';
/**
 * @apiDefine admin Acesso permitido para admins
 * O acesso a esse endpoint é permitido apenas para usuários admin
 */

 /**
 * @apiDefine FieldsSerie
 * @apiSuccess {String} _id ID.
 * @apiSuccess {String} titulo Titulo.
 * @apiSuccess {Integer} __v 
 * @apiSuccess {String} path 
 * @apiSuccess {String} posterStart Link.
 * @apiSuccess {updatedAt} series Series.
 * @apiSuccess {String} uriPage Link.
 */

/**
 * @apiDefine Header
 * @apiHeader {String} x-access-token Token.
 */

/**
 * @apiDefine HeaderExample
 * @apiHeaderExample {json} Header Exemplo 
 *  {
 *    "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4"
 *  }
 */

 /**
 * @apiDefine NenhumToken
 * @apiErrorExample {json} Nenhum token fornecido
 *  HTTP/1.1 401 OK
 *  {
 *    auth: false, 
 *    message: "Nenhum token fornecido"
 *  }
 */

 /**
 * @apiDefine FalhaAutenticar
 * @apiErrorExample {json} Falha ao autenticar token
 *  HTTP/1.1 500 OK
 *  {
 *    auth: false, 
 *    message: "Falha ao autenticar token"  
 *  }
 */



/**
 * @api {get} /series Listar todas series
 * @apiGroup Series
 * @apiPermission authenticated
 *
 * @apiUse Header
 * @apiUse HeaderExample
 * @apiUse FieldsSerie
 * 
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  [
 *    { 
 *      "_id": "5bf00fc03846d0e8ea842ed7", 
 *      "titulo": "Supernatural", 
 *      "__v": 0, 
 *      "createdAt": "2018-11-17T12:55:28.304Z",
 *      "path": "Supernatural", 
 *      "posterStart": "https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg", 
 *      "updatedAt": "2018-11-17T13:34:11.220Z", 
 *      "uriPage": "https://tuaserie.com/serie/assistir-serie-supernatural-online/"
 *    },
 *    { 
 *      "_id": "5bf00fc43846d0e8ea842f1f", 
 *      "titulo": "Chicago MED", 
 *      "__v": 0, 
 *      "createdAt": "2018-11-17T12:55:32.552Z", 
 *      "path": "Chicago_MED", 
 *      "posterStart": "https://image.tmdb.org/t/p/w300/jMvkqK2uQbghLgZUNEhYL1SHT7e.jpg",
 *      "updatedAt": "2018-11-17T12:58:45.876Z", 
 *      "uriPage": "https://tuaserie.com/serie/assistir-chicago-med/"
 *    },
 *  ...
 * ]
 * 
 * @apiUse NenhumToken
 * @apiUse FalhaAutenticar
 */
router.get(prefix, series.findAll);

/**
 * @api {get} /series/:serieId Encontrar série 
 * @apiGroup Series
 * @apiPermission authenticated
 * 
 * @apiParam {String} serieId Id da Serie
 * 
 * @apiUse Header
 * @apiUse HeaderExample
 * 
 * @apiUse FieldsSerie
 *  
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  { 
 *    "_id": "5bf00fc03846d0e8ea842ed7", 
 *    "titulo": "Supernatural", 
 *    "__v": 0, 
 *    "createdAt": "2018-11-17T12:55:28.304Z",
 *    "path": "Supernatural", 
 *    "posterStart": "https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg", 
 *    "updatedAt": "2018-11-17T13:34:11.220Z", 
 *    "uriPage": "https://tuaserie.com/serie/assistir-serie-supernatural-online/"
 *  },
 * 
 * @apiUse NenhumToken
 * @apiUse FalhaAutenticar
 */
router.get(prefix+'/:serieId', series.findOne);

/**
 * @api {post} /series/ Criar serie
 * @apiGroup Series
 * @apiPermission admin
 * 
 * @apiUse Header
 * @apiUse HeaderExample
 * 
 * @apiParam {String} titulo Titulo da Serie
 * @apiParam {String} path Titulo da Serie
 * @apiParam {String} posterStart Link do poster da Serie
 * @apiParam {String} uriPage Link da Serie
 * 
 * @apiParamExample {json} Exemplo de serie
 *  {
 *    "titulo": "Supernatural", 
 *    "path": "Supernatural", 
 *    "posterStart": "https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg", 
 *    "uriPage": "https://tuaserie.com/serie/assistir-serie-supernatural-online/"
 *  }
 * 
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *    { 
 *      "_id": "5bf00fc03846d0e8ea842ed7", 
 *      "titulo": "Supernatural", 
 *      "__v": 0, 
 *      "createdAt": "2018-11-17T12:55:28.304Z",
 *      "path": "Supernatural", 
 *      "posterStart": "https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg", 
 *      "updatedAt": "2018-11-17T13:34:11.220Z", 
 *      "uriPage": "https://tuaserie.com/serie/assistir-serie-supernatural-online/"
 *    },
 * 
 * @apiUse NenhumToken
 * @apiUse FalhaAutenticar
 */
router.post(prefix, isAdmin, series.create);

/**
 * @api {put} /series/:serieId Atualizar serie
 * @apiGroup Series
 * @apiPermission admin
 * 
 * @apiUse Header
 * @apiUse HeaderExample
 * 
 * @apiParam {String} titulo Titulo.
 * @apiParam {String} path .
 * @apiParam {String} posterStart Link para imagem de poster da Série.
 * @apiParam {String} uriPage Link da Série.
 * 
 * 
 * @apiSuccess {json} series Series.
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  {
 *  }
 * 
 * @apiUse NenhumToken
 * @apiUse FalhaAutenticar
 */
router.put(prefix+'/:serieId', isAdmin, series.update);

/**
 * @api {delete} /series/:serieId Deletar serie
 * @apiGroup Series
 * @apiPermission admin
 * 
 * @apiParam {String} serieId Id da Serie
 * 
 * @apiUse Header
 * @apiUse HeaderExample
 * 
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  {
 *    
 *  }
 * 
 * @apiUse NenhumToken
 * @apiUse FalhaAutenticar
 */
router.delete(prefix+'/:serieId', isAdmin, series.delete);

module.exports = router;