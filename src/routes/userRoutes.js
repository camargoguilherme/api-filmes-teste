const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const User = require('../models/userModel');

const prefix = '/users'

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

// Create a new User
router.post(prefix, users.create);

// Retrieve all Users
router.get(prefix, users.findAll);

// Retrieve a single User with userId
router.get(prefix+'/:userId', users.findOne);

// Update a User with userId
router.put(prefix+'/:userId', users.update);

// Delete a User with userId
router.delete(prefix+'/:userId', users.delete);

module.exports = router;