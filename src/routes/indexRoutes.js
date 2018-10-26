const { Router } = require('express');
const router = new Router();
var User = require('../models/userModel');
var jwt = require('jsonwebtoken');
var { isAuthenticate, authenticate } = require('../auth/authServices');



//POST route for updating data
router.post('/login', authenticate);

//POST route for updating data
router.post('/signup', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  console.log(req.body)
  if (username && password) {
    User.create({
      username : username,
      email : email,
      password : password,
      admin: false
    },
    function (err, user) {
      if (err) 
        return res.status(500).send({"error":err, "message":"There was a problem registering the user."})
      // create a token
      var token = jwt.sign({ id: user._id }, process.env.JWT_WORD, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    });
  }else{
    res.status(400).send({ "message": "campos obrigatorios" });
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