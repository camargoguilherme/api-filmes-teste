const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const { isAuthenticate } = require('./auth/authServices');

// Configuring the database
const dbConfig = require('./config/databaseConfig');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.URL || dbConfig.urlExt, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
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

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//Rotas
const indexRoutes = require('./routes/indexRoutes');
const parseRoutes = require('./routes/parseRoutes');
const filmeRoutes = require('./routes/filmeRoutes');
const serieRoutes = require('./routes/serieRoutes');
const temporadaRoutes = require('./routes/temporadaRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



//prefix url
const prefix = '/api/v1';

app.get('/', function(req, res, next){
  return res.redirect(prefix)
})

app.get(prefix, function (req, res, next) {
  res.status(200).send({
    title: "Node Express API",
    version: "0.0.1"
  });
});
app.use(isAuthenticate);
app.use(prefix, indexRoutes);
app.use(prefix, parseRoutes);
app.use(prefix, filmeRoutes);
app.use(prefix, serieRoutes );
app.use(prefix, temporadaRoutes);
app.use(prefix, userRoutes);

module.exports = app;