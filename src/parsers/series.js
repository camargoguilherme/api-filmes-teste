const request = require('request');
const rp = require('request-promise');
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
    await Serie.deleteMany({})
    await prepareSerie(link)
    res.json(MESSAGE_SERIE)
  }

  async temporadas(req, res){
    //deleteMany()
    const series = await Serie.find({})
    
    Promise.all(
      series.map( serie =>{
        prepareTemporadas(serie)
      })
    ).then( serie => serie)
    
    res.json(MESSAGE_TEMPORADA)
    
  }

  async episodios(req, res){
    // const series = await Serie.find({}).populate({
    //   path: 'temporadas',
    //   // Get friends of friends - populate the 'friends' array for every friend
    //   populate: { path: 'episodios' }
    // })

    const episodios = await Episodio.find({referer: 'https://www.rjseries.com/the-good-doctor-online-4/'})

    console.log(episodios[0])

    prepareEpisodios(episodios[0])

    // Promise.all(
    //   episodios.map( episodio =>{
    //     prepareEpisodios(episodio)
    //   })
    // ).then( serie => serie)
    res.json({message: 'Testando episodio'})
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
          $('.esquerda > ul.lista-filmes').children().each( function(i, elem) {
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
              prepareTemporadas(serie)
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
function prepareTemporadas({ title, uriPage, posterStart }){    
  MESSAGE_TEMPORADA.status = 'successful'
    console.log(`Preparando Serie:\n Titulo: ${title}\n URL: ${uriPage}`)
    rp(uriPage)
    .then(function(html) {
      var $ = cheerio.load(html)
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
            if($(this).children().children().children('li').text() != 'NÃO DISPONÍVEL'){

              $(this).children().children().children('li').each(function(i, elem){
                
                const title = $(this).children('a').text() //+ ' - ' +$(this).children('a').attr().title.split(' - ')[1]
                const uri = $(this).children('a').attr().href
                const dublado = true
                temporada.episodios.push({title, uri, dublado, referer: uriPage})
                
              })
            }
          }
          if($(this).children().children().children('strong').text() == 'LEGENDADO'){
            if($(this).children().children().children('li').text() != 'NÃO DISPONÍVEL'){

              $(this).children().children().children('li').each(function(i, elem){
                
                const title = $(this).children('a').text() //+ ' - ' +$(this).children('a').attr().title.split(' - ')[1]
                const uri = $(this).children('a').attr().href
                const dublado = false
                temporada.episodios.push({title, uri, dublado, referer: uriPage})
                
              })
            }
          }
        })
        serie.temporadas.push(temporada)
        
      });
      Promise.all(
        serie.temporadas.map(function(temp, i) {
          return Promise.all(
            temp.episodios.map(function(ep, i) {
              return Episodio.create(ep).then( e => e)
            })
          ).then( episodios => {
            temp.episodios = episodios
            return Temporada.create(temp).then( t => t)
          })
        })
      ).then( temporadas => {
        serie.temporadas = temporadas
        Serie.updateOne({title: serie.title}, serie, { upsert: true}).then()
      })
      return serie
    })
    .then(function(serie) {
      console.log(`${serie.title} conculida`);
    })
    .catch(function(err) {
      //handle error
      writeLog('temporada','prepare', JSON.stringify(err))
  });
}

async function prepareEpisodios2(episodio){
  var options = {
    uri: episodio.uri,
    headers: {
      'Referer': episodio.referer
    }
  };
  rp(options)
  .then(function(html) {
    var $ = cheerio.load(html)
    writeFile('./series/html.html', html)
    console.log($('.esq > .conteudo').html())

  })
  .then(function(serie) {
    console.log(`${serie.title} conculida`);
  })
  .catch(function(err) {
      //handle error
      writeLog('temporada','prepare', JSON.stringify(err))
  });
}

async function prepareEpisodios({ uri, referer}){
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  try{
    const page = await browser.newPage();
    //await page.setRequestInterception(true)
    await page.setExtraHTTPHeaders({
      'Referer': referer
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(uri); 
    let links = await page.evaluate(() => {
      return document.querySelector('.esq > .conteudo').innerHTML 
    });
    writeFile('./series/attr.json', urlify(links))
    // let links = [];
    
    // for(i = 1; i < countLinks; i++){
    //   let player = `#player-option-${i}`;
      
    //   let titles = await page.evaluate(() => {
    //     let title = [];
    //     let div = document.getElementById("playeroptionsul");
    //     let spans = div.getElementsByClassName("title");
      
    //     for(i=0;i<spans.length;i++){
    //       title.push(spans[i].innerHTML);
    //     }
    //     return title;
    //   });

    //   await page.waitFor(player);
    //   await page.click(player);
      
    //   await page.waitFor('div.pframe');
    //   let link = await page.evaluate(() => {
    //     return document.querySelector('div.pframe').innerHTML;
    //   });

    //   links.push({title: `${titles[i]}`, uri: `${urlify(link)}`});
    //   await page.waitFor(10000);
    //}

    //browser.close();
  } catch (error) {
    console.error(error)
    //browser.close();
  }
}

function deleteMany(){
  Promise.all(
    [Episodio.deleteMany({}).then(),
      Temporada.deleteMany({}).then()]
  ).then()
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

async function getImgURL(href){
    
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
    writeLog('image-url','prepare', JSON.stringify(err))
  }
}

async function getMovieURL(href) {
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
    writeLog('movie-url','prepare', JSON.stringify(err))
  }
}

function urlify(text) {
  //var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)]$)/g;
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  //var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[^(.jpg)|(.png)|(.mp4)])/g;
  
  let aux = ''+ text.match(urlRegex)
  
  console.log(text);
  return aux;
}

module.exports = new ParserSeries();