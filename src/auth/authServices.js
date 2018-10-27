var User = require('../models/userModel');
var jwt = require('jsonwebtoken');

//Verifica se usuario esta autenticado
exports.authenticate = (req, res, done) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body)
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return done(err)
      } else if (!user) {
        var err = new Error({message: 'Erro ao realizar login, usuário não encontrado'});
        err.status = 401;
        return done(err);
      }
      if(!user.authenticateUser(password)){
        var err = new Error('Usuário ou senha inválidos');
        err.status = 401;
        return done(err);
      }else{
        return res.status(200).send(user.toJson());
      }
    });
}

//Verifica se usuario esta autenticado
exports.isAuthenticate = (req, res, next) => {
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(401).send({ auth: false, message: 'Nenhum token fornecido' });
  
  jwt.verify(token, process.env.JWT_WORD || config.secret, function(err, decoded) {
    if (err) 
      return res.status(500).send({ auth: false, message: 'Falha ao autenticar token' });
    //res.status(200).send(decoded);
    return next();
  });
}


// Verifica se usuario é admin
exports.isAdmin = (req, res, callback) => {
  var token = req.headers['x-access-token'];
  let userId;
  if (!token) 
    return res.status(401).send({ auth: false, message: 'Nenhum token fornecido' });
  
  jwt.verify(token, process.env.JWT_WORD , function(err, decoded) {
    console.log(decoded)
    if (err) 
      return res.status(500).send({ auth: false, message: 'Falha ao autenticar token' });
    User.findOne({ _id: decoded._id })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        /*var err = new Error('Usuário não encontrado');
        err.status = 401;*/
        return callback(err);
      }
      if (user.admin) {
        return callback(null, user);
      } else {
        var err = new Error('Usuário não é admin');
        err.status = 401;
        return callback(err);
      }
    });
  });
  
}