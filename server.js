const app = require('./src/app');
const port = normalizaPort(process.env.PORT || '3000');

function normalizaPort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Erro em realizar ação');
  err.status = 404;
  next(err);
});*/

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({"message":err.message});
});

app.listen(port, function () {
  console.log(`API running on http://localhost:${port}`)
})