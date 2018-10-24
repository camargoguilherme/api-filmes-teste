const express = require('express');
const router = express.Router();

router.get('/',function (req, res, next) {
  res.status(200).send({
    title: "Node Express API",
    version: "0.0.1"
  });
});

//POST route for updating data
router.post('/login', function (req, res, next) {
  console.log(req.body)
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('username ou senha inválidos');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return next();
      }
    });
  } else {
    var err = new Error("usuario não autenticado");
    err.status = 400;
    return next(err);
  }
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;