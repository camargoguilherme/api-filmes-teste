const parseFilmes = require('../model/parseFilmes')
const parseSeries = require('../model/parseSeries')

exports.getFilmes = (req, res, next) => {  
  console.log('getFilmes')
  res.status(200).send(
    parseFilmes.parseFilmes()
  );
};

exports.getSeries = (req, res, next) => { 
  console.log('getSeries') 
  res.status(200).send(
    parseSeries.getSeries()
  );
};


exports.getTemporadas = async (req, res, next) => {  
  let link = req.body.link;
  let serie = req.body.serie;
  console.log('getTemporadas\nlink: '+link+ '\nserie: '+serie )
  console.log('link: '+link )
  console.log('serie: '+serie )
  let temporadas =  await parseSeries.getTemporadas(link, serie);
  res.status(200).send(
    JSON.parse(temporadas)   
  );
};

exports.getPreparar = (req, res, next) => { 
  console.log('getPreparar') 
  let series = parseSeries.getSeries();
  let temporadas = Array();
  
  res.status(200).send(
    series 
  );
};