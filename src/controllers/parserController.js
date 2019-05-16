//const parseFilmes = require('../parsers/filmes')
const pfHeadLess = require('../parsers/filmesHeadless')
const parserSeries = require('../parsers/series')

class ParserController{
  async filmes(req, res, next){  
    console.log('Preparando Filmes')
    pfHeadLess.filmes(req, res, next);
  };
  
  async series(req, res, next){ 
    console.log('Preparando Series')
    parserSeries.series(req, res, next); 
    
  };
  
  async temporadas(req, res, next){  
    console.log('Preparando Temporadas')
    parserSeries.temporadas(req, res, next)
  };
  
}

module.exports = new ParserController();