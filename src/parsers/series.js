const request = require('request');
const cheerio = require('cheerio')
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const fs = require('fs');
const puppeteer = require('puppeteer');

const urlFileSerie = './series/';
const urlFileTemporada = './temporadas/';

const Serie = require('../models/serie');
const Temporada = require('../models/temporada');
const Episodio = require('../models/episodio');

const MESSAGE_SERIE = { status: '', message: 'Series salvas no banco com sucesso'};
const MESSAGE_TEMPORADA = { status: '', message: 'Temporadas salvas no banco com sucesso'};
const args = 
  ["--disable-gpu",
  //"--disable-setuid-sandbox",
  //"--force-device-scale-factor",
  //"--ignore-certificate-errors",
  "--no-sandbox"];

const CONFIG_PUPPETEER = {
	args,
	headless: false,
	ignoreHTTPSErrors: true,
	dumpio: true,
};
class ParserSeries{
  async series(req, res){
    const link = 'https://www.rjseries.com'
    const uriPage = 'https://www.rjseries.com/supernatural-assistir/'
    //prepareSerie(link)
    await this.prepareTemporadas({uriPage})

    let sec = 0
    const time = setInterval(() => {
      sec += 1;
      if(MESSAGE_SERIE.status != '' || MESSAGE_TEMPORADA.status != ''){
        clearInterval(time)
        console.log(`Voce esperou ${sec} segundos`)
        console.info(MESSAGE_TEMPORADA)
        res.json(MESSAGE_TEMPORADA);
      }
    }, 1000);
  }
  
  async getTemporadas(){
    try {
      let series = await Serie.find({status: false},{_id:1, titulo:1, uriPage:1}, function (err, series) {
        if(err) 
          console.error(error)
        return series;
      });
      
      let index = 0;
      let time = setInterval(() => {
          parseTemporadas(series[index], index+1);
          index+=1
          if(index == series.length){
            clearInterval(time)
            console.log(`Voce esperou ${parseInt((index/2)/60)} m: ${(index/2)%60} s`)
          }
      }, 500); 
      return {message: `Temporadas salvas no banco com sucesso`};;
    } catch (err) {
      return err
    }
    
  }

  async getPreparar(){
    let sec = 120
    console.log(`Voce esperou ${sec/60} m: ${parseInt(sec%60)} s`)
  }

  async getEpisodio(episodio){
    let episodios = new Array();
    let index = 0;
    let link = 'https://tuaserie.com/ep.php?cod=';
    
    episodio.map( episodio=>{
      if(!episodio.dublado){
        let ep ={};
        ep.titulo = episodio.titulo;
        ep.legendado = link+Base64.encode(episodio.uri);
        episodios.push(ep);
      }    
    })

    if(episodios.length == 0){
      episodio.map( episodio => {
        let ep ={};
        ep.titulo = episodio.titulo;
        ep.dublado = link+Base64.encode(episodio.uri);
        episodios.push(ep);
      })  
    }else{
      episodio.map( episodio => {
      
        if(index < episodios.length){
          if(episodio.dublado && episodio.titulo == episodios[index].titulo){
            episodios[index].dublado = link+Base64.encode(episodio.uri);
            index++
          }
        }
      })  
    }
    
    return episodios;
  }

  async insertSerie(serie){
    
    Serie.findOneAndUpdate({titulo: serie.titulo},
      serie,
      {upsert: true},
      function (err, serie) {
        if (err) console.error(error)
        return serie;
      }
    ).then()
  };

  async insertTemporadas(serieId, temporadas){
    Temporada.findOneAndUpdate({serieId: serieId},
      {
        serieId,
        temporadas
      },
      {upsert: true},
      function (err, temporada) {
        if (err) console.error(error)
        return temporada;
      }
    ).then()
  };

  async deleteSeriesETemporadas(){
    const series = await Serie.deleteMany({}/*,
      function (err, result) {
        if (err)  
          return err;
        return result;
      }*/
    ) 
    const temporada = await Temporada.deleteMany({}/*,
      function (err, result) {
        if (err)  
          return err;
        return result;
      }*/
    ) 
    console.log(series);
    console.log(temporada);
  };

  async getImgURL(href){
    
    try {
      //let response = await fetch(href);
      //let responseText = await response.text();

      responseText = JSON.parse(readFileSync('teste.html')); 

      const dom = new JSDOM(responseText);
      let img = parse(dom.window.document.querySelector('#home_video').innerHTML);
      let uris = urlify(JSON.stringify(img));
      console.log('uri img: ' + uris)
      return uris;
    } catch (error) {
      console.error(error);
    }
  }

  async getMovieURL(href) {
    try {
      console.log('\ngetMovieURL')
      console.log('href: '+href)
      let response = await fetch(href);
      console.log('response: '+JSON.stringify(response))
      let responseText = await response.text();

      console.log('responseText: '+responseText)

      const dom = new JSDOM(responseText);
      let movieUrl = parse(dom.window.document.querySelector('#preview').innerHTML);
      let url = movieUrl[1].children[1].children[1].children[5].attributes[6].value;

      
      return url;
    } catch (error) {
      console.error(error);
    }
  }

  urlify(text) {
    //var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)]$)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[^(.jpg)|(.png)|(.mp4)])/g;
    
    let aux = ''+ text.match(urlRegex)
    aux = aux.substring(0,4+aux.search(/(.jpg)|(.png)|(.mp4)/g))
    console.log(text);
    return aux;
  }

  // Função para preparar as Series
  async prepareSerie(LINK_SERIE = null){
    if(LINK_SERIE){
      request(LINK_SERIE, function (error, response, body) {
        if(response && response.statusCode == 200){
          var $ = cheerio.load(body)
          
          $('ul.lista-filmes').children().each(function(i, elem) {
            let title = $(this).children('.titulo-box').children('h2').children('a').text().replace(/\W+/g, '_')
            let uriPage = $(this).children('div').children('h2').children('a').attr().href;
            let posterStart = $(this).children('.capa').children('img').attr().src;
            // let urlFileTemporada = title.replace(/\W+/g, '_');
            const serie = {
              title,
              uriPage,
              posterStart
            }
            //writeFile(`${urlFile}${title}.json`, JSON.stringify(serie))      
          });
          const NEXT = $('div.navigation').children('a.next').attr() ? $('div.navigation').children('a.next').attr().href : null;
          if(NEXT){
            console.log('next link: '+ NEXT)
            prepareSerie(NEXT)
          }
        }
        if(error){
          MESSAGE_SERIE.status = 'error'
          MESSAGE_SERIE.message = error
        }
        MESSAGE_SERIE.status = 'successful'
      });
    }
  }

  // Função para preparar as Temporadas
  async prepareTemporadas({uriPage}){
    
    request(uriPage, function (error, response, body) {
      if(response && response.statusCode == 200){
        var $ = cheerio.load(body)
        
        $('div.tab_container').children().each(async function(i, elem) {
          const t = i + 1
          const temporada = await Temporada.findOneAndUpdate({title: `${t}ª Temporada`}, {title: `${t}ª Temporada`}, { title: 1, episodios: 1, upsert: true })
          
          $(this).children().each(async function(i, elem) {
            if($(this).children().children().children('strong').text() == 'DUBLADO'){
              $(this).children().children().children('li').each( async function(i, elem){
                
                const title = $(this).children('a').text() + ' - ' +$(this).children('a').attr().title.split(' - ')[1]
                const url = $(this).children('a').attr().href
                const dublado = true
                const episodio = await Episodio.create({title, url, dublado})
                temporada.episodios.push(episodio)
              
              })
            }
            if($(this).children().children().children('strong').text() == 'LEGENDADO'){
              $(this).children().children().children('li').each( async function(i, elem){
                
                const title = $(this).children('a').text() + ' - ' +$(this).children('a').attr().title.split(' - ')[1]
                const url = $(this).children('a').attr().href
                const dublado = false
                const episodio = await Episodio.create({title, url, dublado})
                temporada.episodios.push(episodio)
              
              })
            }
            await temporada.save()
          })
          
          
        });
        
      }
      if(error){
        MESSAGE_TEMPORADA.status = 'error'
        MESSAGE_TEMPORADA.message = error
      }
      MESSAGE_TEMPORADA.status = 'successful'
    });
  }

}


function writeFile(path, data){
  fs.writeFileSync(path, data,function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
}

function appendFile(path, data){
  fs.appendFileSync(path, data,function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
}

function readFile(path){
  let data;
  if(fs.existsSync(path)){
    data = fs.readFileSync(path, 'utf8', function (err,data) {
      if (err) {
        return console.error(err);
      }
      return data;
    });
  }
  return data;
}

module.exports = new ParserSeries();