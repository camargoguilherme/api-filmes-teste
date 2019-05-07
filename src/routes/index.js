const { Router } = require('express');
const router = new Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');  
var { isAuthenticate, authenticate } = require('../auth/authServices');

/**
 * @api {post} /login Login
 * @apiGroup Auth
 * 
 * @apiParam {String} username  Usuário.
 * @apiParam {String} password  Senha.
 * 
 * @apiParamExample {json} Login exemplo:
 *     {
 *       "username": "username-example",
 *       "password": "password-example"
 *     }
 *
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  {
 *    auth: true,
 *    _id: "5bd08c3304bf9a313bb9daf6",
 *    username: "teste",
 *    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4"      
 *  }
 * 
 * @apiErrorExample {json} Usuário ou senha inválidos
 *  HTTP/1.1 401 OK
 *  {
 *    message: "usuário ou senha inválidos"
 *  }
 * 
 * @apiErrorExample {json} Usuário não encontrado
 *  HTTP/1.1 401 OK
 *  {
 *    message: "usuário não encontrado"  
 *  }
 */
router.post('/login', authenticate);

/**
 * @api {post} /signup Signup
 * @apiGroup Auth
 * 
 * @apiParam {String} username  Usuário.
 * @apiParam {String} password  Senha.
 * @apiParam {String} fullname  Nome completo.
 * @apiParam {String} email     Email.
 * 
 * @apiParamExample {json} Signup exemplo:
 *     {
 *       "username": "teste",
 *       "password": "teste123",
 *       "fullname": "Teste Teste",
 *       "email": "exemplo@teste.com"
 *     }
 *
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  {
 *    auth: true,
 *    _id: "5bd08c3304bf9a313bb9daf6",
 *    username: "teste",
 *    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4"      
 *  }
 */
router.post('/signup', function (req, res, next) {
  let username = req.body.username;
  let fullname = req.body.fullname;
  let password = req.body.password;
  let email = req.body.email;
  console.log(req.body)
  if (username && password) {
    User.create({
      username : username,
      fullname: fullname,
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

/**
 * @api {get} /logout Logout
 * @apiGroup Auth
 * 
 * @apiSuccess {Object[]} profiles       List of user profiles.
 * @apiSuccess {Number}   profiles.age   Users age.
 * @apiSuccess {String}   profiles.image Avatar-Image.
 */
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

/**
 * @api {post} /authenticated Authenticated
 * @apiGroup Auth
 * 
 * @apiHeader {String} x-access-token Token.
 * 
 * @apiHeaderExample {json} Header Exemplo
 *  {
 *    "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4"
 *  }
 * 
 * @apiErrorExample {json} Nenhum token fornecido
 *  HTTP/1.1 401 OK
 *  {
 *    auth: false, 
 *    message: "Nenhum token fornecido"
 *  }
 * 
 * @apiErrorExample {json} Falha ao autenticar token
 *  HTTP/1.1 500 OK
 *  {
 *    auth: false, 
 *    message: "Falha ao autenticar token"  
 *  }
 */
router.get('/authenticated', (req, res, next) =>{
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(401).send({ auth: false, message: 'Nenhum token fornecido' });
  
  jwt.verify(token, process.env.JWT_WORD, function(err, decoded) {
    if (err) 
      return res.status(500).send({ auth: false, message: 'Falha ao autenticar token' });
    //res.status(200).send(decoded);
    res.status(200).send({ auth: true, token: token });
  });
});


module.exports = router;