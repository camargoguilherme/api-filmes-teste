const express = require('express');
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var compression = require('compression');
const { isAuthenticate } = require('./auth/authServices');

// Configuring the database
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.URL_DEV || process.env.URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
    if(process.env.URL_DEV)
      console.log('Conetado a base de Desenvolvimento')
    else
      console.log('Conetado a base de Produção')
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

app.use(cors());
app.use(compression());

//Rotas
// const index = require('./routes/index');
const parser = require('./routes/parser');
// const filme = require('./routes/filmes');
// const serie = require('./routes/series');
// const temporada = require('./routes/temporadas');
// const user = require('./routes/user');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



//prefix url
const prefix = '/api/v1';
/** 
 * @api {get} / Status
 * @apiGroup Status
 * @apiSuccess {String} status Mensagens de status da API
 * @apiSuccessExample {json} Sucesso
 *  HTTP/1.1 200 OK
 *  {
 *    title: "Node Express API",
 *    version: "0.0.1"
 *  }
 */
app.get('/', function(req, res, next){
  return res.redirect(prefix)
})
app.get(prefix, function(req, res, next){
  return res.redirect(prefix+'/apidoc')
})

app.get(prefix+'/status', function (req, res, next) {
  res.status(200).send({
    title: "Node Express API",
    version: "0.0.1"
  });
});
app.use(prefix, express.static("public"))
// app.use(prefix, index);
// app.use(isAuthenticate);
app.use(prefix, parser);
// app.use(prefix, filmes);
// app.use(prefix, series );
// app.use(prefix, temporada);
// app.use(prefix, user);

/*
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));*/

module.exports = app;