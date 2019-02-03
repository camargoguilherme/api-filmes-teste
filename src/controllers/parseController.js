const parseFilmes = require('../models/parseFilmes')
const pfHeadLess = require('../models/parseFilmesHeadless')
const parseSeries = require('../models/parseSeries')

exports.getFilmes = async (req, res, next) => {  
  console.log('getFilmes')
  let filmes =  await pfHeadLess.getFilmes();
  res.status(200).send(
   filmes
  );
};


exports.getFilme = (req, res, next) => {  
  let link = req.body.link;
  let filme =  parseFilmes.getFilme(link);
  console.log(link)
  res.status(200).send(
    filme   
  );
};



exports.getSeries = async (req, res, next) => { 
  console.log('getSeries')
  let message = await parseSeries.getSeries(); 
  res.status(200).send(
    message
  );
};


exports.getTemporadas = async (req, res, next) => {  
  console.log('getTemporadas')
  let temporadas =  await parseSeries.getTemporadas();
  res.status(200).send(
    temporadas   
  );
};

exports.getPreparar = async (req, res, next) => { 
  console.log('getPreparar') 
  const SERIE = 
    {
      titulo: 'Supernatural',
      url: 'https://www.tuaserie.com/serie/assistir-serie-supernatural-online.html'
    }
  let series = await parseSeries.getPreparar(SERIE);  
  res.status(200).send(
    series
  );
};