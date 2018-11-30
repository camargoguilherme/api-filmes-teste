const request = require('request');
const cheerio = require('cheerio')
const fs = require('fs')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const urlFile = './series.json';
const urlFileTeste = './series-teste.json';
const Serie = require('../models/serieModel');
const Temporada = require('../models/temporadaModel');

exports.getSeries = (link = 'https://tuaserie.com/') => {
  let message = null;
  request(link, function (error, response, body) {
    if(response && response.statusCode == 200){
      var $ = cheerio.load(body)
      response = null;
      $('.image').each(function(i, elem) {
        let titulo = $(this).children('a').children('img').attr().alt.replace(/&amp;/g, '\&').replace('Assistir', '').trim();
        titulo = titulo.replace(/&amp;/g, '\&');
        titulo = titulo.replace('Assistir', '').trim();
        let uriPage = $(this).children('a').attr().href;
        let posterStart = $(this).children('a').children('img').attr().src;
        let urlFileTemporada = titulo.replace(/\W+/g, '_');
        serie = {
          titulo: titulo,
          uriPage: uriPage,
          posterStart: posterStart,
          path: urlFileTemporada,
          status: false,
          temporadas: 0
        }
        if(i > 0){
          console.log(`${i} - ${titulo}`)
          insertSerie(serie);   
        }             
      });
    }
    if(error)
      message = error
    message = {message: `Series salvas no banco com sucesso`};
  });
  let sec = 0
  let time = setInterval(() => {
    sec += 1;
    if(message != null){
      console.log(`Voce esperou ${sec} segundos`)
      clearInterval(time)
    }
  }, 1000);
  
  return message;
}

exports.getTemporadas = async() => {
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

exports.getPreparar = () =>{
  let sec = 120
  console.log(`Voce esperou ${sec/60} m: ${parseInt(sec%60)} s`)
}

function getEpisodio(episodio){
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

function parseTemporadas(serie, index){
  request(serie.uriPage, async function (error, response, body) {
    if(response && response.statusCode == 200){
  
      const dom = new JSDOM(body);
      uri = dom.window.document.querySelector('#preview > div > div > header').innerHTML;
      uri = '#' + uri.trim() + ']}]';
      uri = uri.replace(/(<div class="+[a-z]+">)/g, '')
      .replace(/(<header>)/g, '')
      .replace(/(<[/]header>)/g, '')
      .replace(/(<[/]div>)/g, '')
      .replace(/(<br><br>)/g, '\n')
      .replace(/(<br>)/g, '\n')
      .replace(/(<[/]a>)/g, '')
      .replace(/(<h2>)/g, ', {"titulo" : "')
      .replace(/(<[/]h2>)/g, '", "episodio": [')
      .replace(/(Episódio)/g, ',{ "titulo":"Episódio')
      .replace(/(\[,{+)/g, '[{')
      .replace(/(: <a href="[/])/g, '", "uri":"')
      .replace(/(>)/g, ', "dublado": ')
      .replace(/&/g, '\&')
      .replace(/(\\", "dublado")/g, '", "dublado"')
      .replace(/(DUBLADO)/g, 'true }')
      .replace(/(LEGENDADO)/g, 'false }')
      .replace(/(INGLÊS)/g, 'false }')
      .replace(/(, {+)/g, ']}, {')
      .replace(/(#]},)/g, '[');

      let temporadas = new Array();

      temporadas = JSON.parse(uri);
      temporadas.map(temp => {
        temp.titulo.replace(serie.titulo, '').trim();
        temp.episodio = getEpisodio(temp.episodio);
        return temp
      });
      
      serie.status = true;
      serie.temporadas = temporadas.length;
      insertTemporadas(serie._id, temporadas);
      insertSerie(serie);
      
      
      console.log(`${index} - ${serie.titulo}: ${temporadas.length} temporadas`)
    }
  });
}

function insertSerie(serie){
  
  Serie.findOneAndUpdate({titulo: serie.titulo},
    serie,
    {upsert: true},
    function (err, serie) {
      if (err) console.error(error)
      return serie;
    }
  ).then()
};

function insertTemporadas(serieId, temporadas){
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

async function deleteSeriesETemporadas(){
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

async function getImgURL(href) {
  
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
    console.error(error);
  }
}

// Create Base64 Object
var Base64 = {
  _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(e){
    var t="";
    var n,r,i,s,o,u,a;
    var f=0;
    e=Base64._utf8_encode(e);
    while(f<e.length){
      n=e.charCodeAt(f++);
      r=e.charCodeAt(f++);
      i=e.charCodeAt(f++);
      s=n>>2;
      o=(n&3)<<4|r>>4;
      u=(r&15)<<2|i>>6;
      a=i&63;
      if(isNaN(r)){u=a=64}
      else 
        if(isNaN(i)){a=64}
      t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)
    }
    return t},
  decode:function(e){
    var t="";
    var n,r,i;
    var s,o,u,a;
    var f=0;
    e=e.replace(/[^A-Za-z0-9+/=]/g,"");
    while(f<e.length){
      s=this._keyStr.indexOf(e.charAt(f++));
      o=this._keyStr.indexOf(e.charAt(f++));
      u=this._keyStr.indexOf(e.charAt(f++));
      a=this._keyStr.indexOf(e.charAt(f++));
      n=s<<2|o>>4;
      r=(o&15)<<4|u>>2;
      i=(u&3)<<6|a;
      t=t+String.fromCharCode(n);
      if(u!=64){
        t=t+String.fromCharCode(r)}
        if(a!=64){
          t=t+String.fromCharCode(i)
        }
      }
      t=Base64._utf8_decode(t);
      return t
    },
    _utf8_encode:function(e){
      e=e.replace(/rn/g,"n");
      var t="";
      for(var n=0;n<e.length;n++){
        var r=e.charCodeAt(n);
        if(r<128){
          t+=String.fromCharCode(r)
        }else 
        if(r>127&&r<2048){
          t+=String.fromCharCode(r>>6|192);
          t+=String.fromCharCode(r&63|128)
        }else{
          t+=String.fromCharCode(r>>12|224);
          t+=String.fromCharCode(r>>6&63|128);
          t+=String.fromCharCode(r&63|128)
        }
      }
      return t},
      _utf8_decode:function(e){
        var t="";
        var n=0;
        var r=c1=c2=0;
        while(n<e.length){
          r=e.charCodeAt(n);
          if(r<128){
            t+=String.fromCharCode(r);n++
          }else 
          if(r>191&&r<224){
            c2=e.charCodeAt(n+1);
            t+=String.fromCharCode((r&31)<<6|c2&63);
            n+=2
          }else{
            c2=e.charCodeAt(n+1);
            c3=e.charCodeAt(n+2);
            t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
            n+=3
          }
        }
        return t}
      }    

function urlify(text) {
  //var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)]$)/g;
  //var urlRegex = /(https?:\/\/[^\s]+)/g;
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[^(.jpg)|(.png)|(.mp4)])/g;
  
  let aux = ''+ text.match(urlRegex)
  aux = aux.substring(0,4+aux.search(/(.jpg)|(.png)|(.mp4)/g))
  console.log(text);
  return aux;
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
