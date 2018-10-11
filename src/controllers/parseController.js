const parse = require('../model/parse')

exports.get = (req, res, next) => {  
  res.status(200).send(
    parse.parseHTML()
  );

};

  