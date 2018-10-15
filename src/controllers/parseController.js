const parseFilmes = require('../model/parseFilmes')
const parseSeries = require('../model/parseSeries')

exports.getFilmes = (req, res, next) => {  
  res.status(200).send(
    parseFilmes.parseHTML()
  );
};

exports.getSeries = (req, res, next) => {  
  res.status(200).send(
    parseSeries.getSeries()
  );
};


exports.getTemporadas = async (req, res, next) => {  
  let link = req.body.link;
  let serie = req.body.serie;

  let temporadas =  await parseSeries.getTemporadas(link, serie);
  res.status(200).send(
    JSON.parse(temporadas)   
  );
};