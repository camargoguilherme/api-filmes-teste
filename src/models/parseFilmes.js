const request = require('request');
const cheerio = require('cheerio')
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const fs = require('fs');
const Filme = require('../models/filmeModel')
const urlFile = './filmes.json';

exports.getFilmes = (link = 'http://gofilmes.me/') => {
  console.log('getFilmes')
  try {
    let filmes = new Array();
    let index = 1
    let time = setInterval(() => {
    let aux = getFilmes(link+'?p='+index);
      aux.map( filme =>{
        filmes.push(filme)
      })
      index+=1
      if(index > 60){
        clearInterval(time)
      }
    }, 15000);
    
  } catch (error) {
    console.error(error);
  }
}

function getFilmes(link){
  try {
    let filmes = new Array();
    request(link, function (error, response, body) {
      console.log(link)
      if(response && response.statusCode == 200){
        var $ = cheerio.load(body)
        $('.poster').each( function(i, elem) {
          let categoria = new Array()
            $(this).children().each( function(i, elem) {
              $(this).children('.t-gen').each( function(i, elem) {
                categoria.push($(this).text()) 
              })
              
            })
          filme = {
            titulo: $(this).children('a').children('img').attr().alt,
            uriPage: $(this).children('a').attr().href,
            posterStart: $(this).children('a').children('img').attr().src.replace(/(w)\d+/g, 'w1280'),
            categoria: categoria
          }
          getPropsFilme(filme);
      
        });
      }
    });
    return filmes;
  } catch (error) {
    console.error(error);
  }
} 
function getPropsFilme(filme){
  request(filme.uriPage, function (error, response, body) {
    if(response && response.statusCode == 200){
      var $ = cheerio.load(body)
      $('body').each( function(i, elem) {
        let url = '' + $(this).children('.player').children('#player').children('script') ;
        try{
          url = url.match(/(https?:\/\/.*\.(?:png|jpg))/g)[0];
        }catch(err){
          url = url.match(/(https?:\/\/.*\.(?:png|jpg))/g);
        }
          
        
        filme.titulo = $(this).children('.dsk').children('.col-1').children('.capa').attr().alt,
        filme.resumo = $(this).children('.dsk').children('.col-2').children('.sinopse').text().replace('Sinopse:', '').trim(),
        filme.posterStart = $(this).children('.dsk').children('.col-1').children('.capa').attr().src.replace(/(w)\d+/g, 'w1280'),

        getUrlFilme(url, filme)
      })
    }
  })
}

function getUrlFilme(url, filme){
  
  request(url, function (error, response, body) {
    if(response && response.statusCode == 200){
      var $ = cheerio.load(body)
      $('body').children('center').children('.align').each( function(i, elem) {
        filme.uri = urlify('' + $(this))
        insertFilme(filme);
        console.log('Filme salvo')
      })
    }
  })
}

function insertFilme(filme){
  
  Filme.findOneAndUpdate({titulo: filme.titulo},
    filme,
    {upsert: true},
    function (err, filme) {
      if (err) console.error(err)
      return filme;
    }
  ).then()
};

exports.getFilme = async (url) => {
  console.log('getFilme')
  /*try {
    let response = await fetch(url);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let links = dom.window.document.querySelector('#player').innerHTML;
    let descricao = dom.window.document.querySelector('.dsk').innerHTML;
    
    let filme = {
      resumo: '',
      uri: '',
      img: ''
    }

    //links = parse(links);
    //links = urlify(links[1].children[0].content)
    links = urlify(links)

    filme.resumo = descricao[3].children[5].children[2].content;
    filme.uri = await getMovieURL( links );
    filme.img = urlify(links[0].substring(5 , links[0].length), true);

    return filme;
  } catch (error) {
    console.error(error);
  }*/
}




function urlify(text) {
  var urlRegex = /(?:(?:https?|ftp):\/\/)(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
  let dubRegex = /(DUBLADO)|(LEGENDADO)/g
  let url = text.match(urlRegex);
  let dub = text.match(dubRegex)
  let length = url.length;
  let links = {
    dublado: new Array(),
    legendado: new Array()
  }
  for(i=0; i<length; i++){
    if(dub[i] == "DUBLADO")
      links.dublado.push(url[i])
    else
      links.legendado.push(url[i])
  }
  return links;
}

function writeFile(path, data){
  fs.writeFileSync(path, data,function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
}

function readFile(path){
  let data;
  if(fs.existsSync(path)){
    data = fs.readFileSync(path, 'utf8', function (err,data) {
      if (err) {
        console.error(err);
        return err;
      }
      return data;
    });
  }
  return data;
}
