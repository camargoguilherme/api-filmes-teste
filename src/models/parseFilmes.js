const request = require('request');
const cheerio = require('cheerio')
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const fs = require('fs');
const Filme = require('../models/filmeModel')
const urlFile = './filmes.json';

exports.getFilmes = (link = 'http://gofilmes.me/') => {
  try {
    let filmes = new Array();
    let index = 1
    filme = {
      uri: null,
      uriPage:'http://gofilmes.me/arraste-me-para-o-inferno',
      referer: null,
      titulo:null,
      posterStart: null,
      categoria: null
    }
    getPropsFilme(filme)
    /*let time = setInterval(() => {
    let aux = getFilmes(link+'?p='+index);
      aux.map( filme =>{
        filmes.push(filme)
      })
      if(index > 60){
        clearInterval(time)
      }
      index++
    }, 15000);
    */
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
            referer: null,
            uri: null,
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
        filme.referer = url        
        filme.titulo = $(this).children('.dsk').children('.col-1').children('.capa').attr().alt;
        filme.resumo = $(this).children('.dsk').children('.col-2').children('.sinopse').text().replace('Sinopse:', '').trim();
        filme.posterStart = $(this).children('.dsk').children('.col-1').children('.capa').attr().src.replace(/(w)\d+/g, 'w1280');

        getUrlFilme(filme)
      })
    }
  })
}

function getUrlFilme(filme){
  request(filme.referer, function (error, response, body) {
    if(response && response.statusCode == 200){
      
      var $ = cheerio.load(body)
      $('body').children('center').children('.align').each( function(i, elem) {
        let urls = urlify('' + $(this));
        filme.uri = urls;
        //insertFilme(filme);
        if(urls.dublado.length>0){
          console.log('urls.dublado')
          urls.dublado.map((url, index)=>{
            getUrl(url, index, true, filme)
          })
        }
          
        if(urls.legendado.length>0){
          console.log('urls.legendado')
          urls.legendado.map((url, index)=>{
            getUrl(url, index, false, filme)
          })
        }

        //console.log('Filme salvo')
        //console.log(filme)
        
      })
    }
  })
}

function getUrl(url, index, dublado, filme){
  const options = {
    url,
    headers: {
      'Referer': filme.referer
    }
  };
  
  request(options, function (error, response, body) {
    if(response && response.statusCode == 200){
      body = body
      .replace(/(%3A)/g,':')
      .replace(/(%2F)/g,'/')
      .replace(/(%3F)/g,'?')
      .replace(/(%3D)/g,'=')        
      let urlFilme = imgUrlify(body);
      if(dublado && urlFilme){
        filme.uri.dublado[index]=urlFilme;
      }
      if(!dublado && urlFilme){
        filme.uri.legendado[index]=urlFilme;
      }
      console.log(filme)
      insertFilme(filme)
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
  var urlImgRegex = /(((https:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)])/g;
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

function imgUrlify(text) {
  var urlRegex = /((https):\/\/streamguard.cc)(([^\s()<>]+|\((?:[^\s()<>]+|(\([^\s()<>]+\)))?\))+(?:\(([^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
  let aux =  text.match(urlRegex)
  if(aux)
    aux = aux[0]
  return aux;
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
