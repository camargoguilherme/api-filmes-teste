const express = require('express');
const router = express.Router();
const temporadas = require('../controllers/temporadaController');
const User = require('../models/userModel');

const prefix = '/temporadas';

// Retrieve all Temporadas
router.get(prefix, temporadas.findAll);

// Retrieve a single Temporada with temporadaId
router.get(prefix+'/:serieId', temporadas.findOne);

// Verifica se o usuario esta autenticado e se é admin
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
          return next()
        }else{
          var err = new Error('Usuario não autorizado');
        err.status = 400;
        return next(err);
        }
                
      }
    }
  });
})


// Create a new Temporada
router.post('/temporadas', temporadas.create);

// Update a Temporada with temporadaId
router.put(prefix+'/:temporadaId', temporadas.update);

// Delete a Temporada with temporadaId
router.delete(prefix+'/:temporadaId', temporadas.delete);

module.exports = router;