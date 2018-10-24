const parseFilmes = require('../models/parseFilmes')
const parseSeries = require('../models/parseSeries')

exports.getFilmes = async (req, res, next) => {  
  console.log('getFilmes')
  let filmes =  await parseFilmes.getFilmes();
  res.status(200).send(
   filmes
  );
};


exports.getFilme = async (req, res, next) => {  
  let link = req.body.link;
  let filme =  await parseFilmes.getFilme(link);
  console.log(link)
  res.status(200).send(
    filme   
  );
};



exports.getSeries = async (req, res, next) => { 
  console.log('getSeries')
  let series = await parseSeries.getSeries(); 
  res.status(200).send(
    series
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
    temporadas   
  );
};

exports.getPreparar = (req, res, next) => { 
  console.log('getPreparar') 
  /*let series = parseSeries.getSeries();
  let temporadas = Array();*/
  
  res.status(200).send(
    {"response":"teste"} 
  );
};