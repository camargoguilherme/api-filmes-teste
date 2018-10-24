const express = require('express');
const router = express.Router();
const series = require('../controllers/serieController');
const User = require('../models/userModel');

const prefix = '/series';

//Rotas antes da verificação para que usuario nao admin possam acessar
// Retrieve all Series
router.get(prefix, series.findAll);

// Retrieve a single Serie with serieId
router.get(prefix+'/:serieId', series.findOne);

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


// Create a new Serie
router.post(prefix, series.create);

// Update a Serie with serieId
router.put(prefix+'/:serieId', series.update);

// Delete a Serie with serieId
router.delete(prefix+'/:serieId', series.delete);

module.exports = router;