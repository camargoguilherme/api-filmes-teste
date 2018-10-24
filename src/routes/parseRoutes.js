const express = require('express');
const router = express.Router();
const controller = require('../controllers/parseController');
const User = require('../models/userModel');

const prefix = '/admin';

// Verifica se o usuario esta autenticado
router.use(prefix, function (req, res, next) {
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error('Usuario não atenticado');
        err.status = 400;
        return next(err);
      } else {
        if(user.admin){
          return next();
        }else{
          var err = new Error('Usuario não autorizado');
          err.status = 400;
          return next(err);
        }
        
      }
    }
  });
})


router.get('parse-filmes', controller.getFilmes);
router.post('parse-filmes', controller.getFilme);

router.get('parse-series', controller.getSeries);
router.post('parse-series', controller.getTemporadas);
router.get('parse-preparar', controller.getPreparar);

module.exports = router;