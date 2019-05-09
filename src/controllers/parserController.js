//const parseFilmes = require('../parsers/filmes')
const pfHeadLess = require('../parsers/filmesHeadless')
const parserSeries = require('../parsers/series')

class ParserController{
  async filmes(req, res, next){  
    console.log('Preparando Filmes')
    pfHeadLess.getFilmes(req, res, next);
  };
  
  
  async filme(req, res, next){  
    let link = req.body.link;
    let filme =  parseFilmes.getFilme(link);
    console.log(link)
    res.status(200).send(
      filme   
    );
  };
  
  
  
  async series(req, res, next){ 
    console.log('Preparando Series')
    parserSeries.series(req, res, next); 
    
  };
  
  
  async getTemporadas(req, res, next){  
    console.log('getTemporadas')
    let temporadas =  await parseSeries.getTemporadas();
    res.status(200).send(
      temporadas   
    );
  };
  
  async getPreparar(req, res, next){ 
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
}

module.exports = new ParserController();