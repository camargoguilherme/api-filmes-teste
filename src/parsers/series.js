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
const Log = require('../models/log');

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
    const title = 'Supernatural'

    // deleteMany()
    //await prepareSerie(link)
    const series = await Serie.find({})
    const lastSerie = series.length-1
    let is = 0       

    const time = setInterval(async () => {
      try {
        prepareTemporadas(series[is])
        if( is == lastSerie){
          clearInterval(time)
        }
        
        is += 1
      } catch (error) {
        writeLog('serie','prepare', JSON.stringify(error))
      }
    
    }, 1000*10);
  }


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
}

// Função para preparar as Series
function prepareSerie(LINK_PAGE = null){
  MESSAGE_SERIE.status = 'successful'
  
  if(LINK_PAGE){
    request(LINK_PAGE, function (error, response, body) {
      try {
        if(response && response.statusCode == 200){
          var $ = cheerio.load(body)
          console.log('link: '+ LINK_PAGE)
          $('.esquerda > ul.lista-filmes').children().each(async function(i, elem) {
            let title = $(this).children('.titulo-box').children('h2').children('a').text()
            let uriPage = $(this).children('.capa').children('a').attr().href;
            let posterStart = $(this).children('.capa').children('img').attr().src;
            // let urlFileTemporada = title.replace(/\W+/g, '_');
            const serie = {
              title,
              uriPage,
              posterStart
            }
            if(title != null && uriPage != null)
              await Serie.create(serie)
          });
          const NEXT = $('div.navigation').children('a.next').attr() ? $('div.navigation').children('a.next').attr().href : null;
          if(NEXT){
            prepareSerie(NEXT)
          }
          
        }
        if(error){
          MESSAGE_SERIE.status = 'error'
          MESSAGE_SERIE.message = error
          writeLog('serie','request', JSON.stringify(error))
        }
      } catch (err) {
        writeLog('serie','saving', JSON.stringify(err))
      }
    });
      
  }
}
  
  // Função para preparar as Temporadas
async function prepareTemporadas({ title, uriPage, posterStart }){    
  MESSAGE_TEMPORADA.status = 'successful'
  request(uriPage, async function (error, response, body) {
    try{
      if(response && response.statusCode == 200){
        var $ = cheerio.load(body)
        const category = []
        $('span.categoria-video > a').each( function(i, elem){
          category.push($(this).text())
        })
        const resume = $('.esquerdavideox > .content-single > p').text()
        resume.substring(0, resume.indexOf(' Ler mais sobre'))
        
        const serie = { title, temporadas: [], category, resume, posterStart }

        $('div.tab_container').children().each( function(i, elem) {
          const t = i + 1
          const temporada = { title: `${t}ª Temporada`, episodios: [] }
          
          $(this).children().each(function(i, elem) {
            if($(this).children().children().children('strong').text() == 'DUBLADO'){
              $(this).children().children().children('li').each(function(i, elem){
                
                const title = $(this).children('a').text() //+ ' - ' +$(this).children('a').attr().title.split(' - ')[1]
                const uri = $(this).children('a').attr().href
                const dublado = true
                temporada.episodios.push({title, uri, dublado})
                
              })
            }
            if($(this).children().children().children('strong').text() == 'LEGENDADO'){
              $(this).children().children().children('li').each( function(i, elem){
                
                const title = $(this).children('a').text() //+ ' - ' + $(this).children('a').attr().title.split(' - ')[1]
                const uri = $(this).children('a').attr().href
                const dublado = false
                temporada.episodios.push({title, uri, dublado})
                
              })
            }
          })
          serie.temporadas.push(temporada)
          
        });
      
        let it = 0       
        const time = setInterval(async () => {
          try {
            const { ops } = await Episodio.collection.insertMany(serie.temporadas[it].episodios)
            const lastTemp = serie.temporadas.length-1
            
            serie.temporadas[it].episodios = ops
            if( it == lastTemp){
              console.log(`salvando serie ${serie.title}`)
              const { ops } = await Temporada.collection.insertMany(serie.temporadas)
              serie.temporadas = ops
              await Serie.create(serie)
              clearInterval(time)
            }
            
            it += 1
          } catch (error) {
            writeLog('temporada','saving', JSON.stringify(error))
          }
        
        }, 500);
      }
      if(error){
        MESSAGE_TEMPORADA.status = 'error'
        MESSAGE_TEMPORADA.message =  error
        writeLog('temporada','request', JSON.stringify(error))
      }
    } catch (error) {
      writeLog('temporada','prepare', JSON.stringify(error))
    }
  });
}

async function deleteMany(){
  await Episodio.deleteMany({})
  await Temporada.deleteMany({})
  await Serie.deleteMany({})
}

async function writeLog(type, title, error){
  try{
    await Log.create({type, title, error})
  } catch (error) {
    writeLog(`log-${type}`,'prepare', error)
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