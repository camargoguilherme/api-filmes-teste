const request = require('request');
const cheerio = require('cheerio')
const fs = require('fs')
const urlFile = './series.json';
const urlFileTeste = './series-teste.json';
const Serie = require('../models/serieModel')
const Temporada = require('../models/temporadaModel')

exports.getSeries = (link = 'https://tuaserie.com/') => {
  request(link, function (error, response, body) {
    if(response && response.statusCode == 200){
      var $ = cheerio.load(body)
      response = null;
      $('.image').each(async function(i, elem) {
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
          console.log("################################################")
          console.log(titulo+ " "+ i)
          series = await insertSerie(serie);   
        }             
      });
    }
    if(error)
      return error
    return {message: `Series salvas no banco com sucesso`};
  });
}

exports.getTemporadas = () => {
  let uri = 'https://tuaserie.com/serie/assistir-smallville-online.html'
  /*let series = await Serie.find({status: false},{_id:1, titulo:1, uriPage:1}, function (err, series) {
    if (err) console.error(error)
    return series;
  });*/
  request(uri, function (error, response, body) {
      if(response && response.statusCode == 200){
        var $ = cheerio.load(body)
        response = null;
        $('#preview').children('.inner').children('.content').children('header').each(function(i, elem) {
          //$(this).attr()
          //$(this).text()
          //let titulos =  $(this).children('h2').toArray().keys;
          
          //  TEMPORADAS
          // $('h2').text().split(/(Smallville [\d] Temporada)/g).filter((item) => item ),
          // $('a').text().split(/((DUBLADO)|(LEGENDADO)|(INGLÊS))/g).filter((item) => item )
          console.log(i)
          console.log(
            temporada
          )
          
          
          
          //console.log(`Salvando ${} temporadas de ${} ${(i+1)}`)
          
        });
      }
      if(error)
        return error
      return {message: `Temporadas salvas no banco com sucesso`};
    });
  
    
}


exports.getPreparar = async (serie) => {
  let uri;
  try {
    let response = await fetch(serie.url);
    let responseText = await response.text();
    let link = 'https://www.blogger.com/video-play.mp4?contentId=';
    const dom = new JSDOM(responseText);
    uri = dom.window.document.querySelector('#preview > div > div > header').innerHTML;
    
    uri = uri.replace(/(<div class="+[a-z]+">)/g, '');
    uri = uri.replace(/(<header>)/g, '');
    uri = uri.replace(/(<[/]header>)/g, '');
    uri = uri.replace(/(<[/]div>)/g, '');
    uri = uri.replace(/(<br><br>)/g, '\n');
    uri = uri.replace(/(<br>)/g, '\n');
    uri = uri.replace(/(<[/]a>)/g, '');
    uri = uri.replace(/(<h2>)/g, ', {"titulo" : "');
    uri = uri.replace(/(<[/]h2>)/g, '", "episodio": [');
    uri = uri.replace(/(Episódio)/g, ',{ "titulo":"Episódio');
    uri = uri.replace(/(\[,{+)/g, '[{');
    uri = uri.replace(/(: <a href="[/])/g, '", "uri":"'+link);
    uri = uri.replace(/(>)/g, ', "dublado": ');
    uri = uri.replace(/(\\", "dublado")/g, '", "dublado"')
    uri = uri.replace(/(DUBLADO)/g, 'true }');
    uri = uri.replace(/(LEGENDADO)/g, 'false }');
    uri = uri.replace(/(INGLÊS)/g, 'false }');
    uri = uri.replace(/(, {+)/g, ']}, {');
    uri = '#' + uri.trim() + ']}]';
    uri = uri.replace(/(#]},)/g, '[');
    //writeFile(`./temporada-teste/${path}.json`, teste);
    let temporadas = new Array();
    let temporadasAux = Array();
    console.log(`Parseando Temporadas de ${serie.titulo}`)
    temporadas = JSON.parse(uri);
    temporadas.forEach(temp => {
      temp.titulo = temp.titulo.replace(serie.titulo, '').trim();
      temp.episodio = getEpisodio(temp.episodio);
      temporadasAux.push(temp); 
    });
    return temporadasAux;
  } catch (error) {
    console.error(error);
  }
}

exports.getTemporadas2 = async() => {

    for(i=0; i<series.length; i++){
      serie = series[i];

      let response = await fetch(series[i].uriPage);
      let responseText = await response.text();
      const dom = new JSDOM(responseText);
      try {
        uri = dom.window.document.querySelector('#preview > div > div > header').innerHTML;
      } catch (err) {
        error.push(serie)
      }
      uri = uri.replace(/(<div class="+[a-z]+">)/g, '');
      uri = uri.replace(/(<header>)/g, '');
      uri = uri.replace(/(<[/]header>)/g, '');
      uri = uri.replace(/(<[/]div>)/g, '');
      uri = uri.replace(/(<br><br>)/g, '\n');
      uri = uri.replace(/(<br>)/g, '\n');
      uri = uri.replace(/(<[/]a>)/g, '');
      uri = uri.replace(/(<h2>)/g, ', {"titulo" : "');
      uri = uri.replace(/(<[/]h2>)/g, '", "episodio": [');
      uri = uri.replace(/(Episódio)/g, ',{ "titulo":"Episódio');
      uri = uri.replace(/(\[,{+)/g, '[{');
      uri = uri.replace(/(: <a href="[/])/g, '", "uri":"');
      uri = uri.replace(/(>)/g, ', "dublado": ');
      uri = uri.replace(/&/g, '\&');
      uri = uri.replace(/(\\", "dublado")/g, '", "dublado"')
      uri = uri.replace(/(DUBLADO)/g, 'true }');
      uri = uri.replace(/(LEGENDADO)/g, 'false }');
      uri = uri.replace(/(INGLÊS)/g, 'false }');
      uri = uri.replace(/(, {+)/g, ']}, {');
      uri = '#' + uri.trim() + ']}]';
      uri = uri.replace(/(#]},)/g, '[');

      let temporadas = new Array();
      let temporadasAux = Array();

      temporadas = JSON.parse(uri);
      temporadas.forEach(temp => {
        temp.titulo = temp.titulo.replace(series[i].titulo, '').trim();
        temp.episodio = getEpisodio(temp.episodio);
        temporadasAux.push(temp); 
      });
      console.log(`Salvando ${temporadasAux.length} temporadas de ${series[i].titulo} ${(i+1)}`)
      await insertTemporadas(series[i]._id, temporadasAux);
      serie.status = true;
      serie.temporadas = temporadasAux.length;
      await insertSerie(serie);
    }
    
 
  return {message: "Temporadas salvas no banco com sucesso"};
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

async function insertSerie(serie){
  
  const s = await Serie.findOneAndUpdate({titulo: serie.titulo},
    serie,
    {upsert: true},
    function (err, serie) {
      if (err) console.error(error)
      return serie;
    }
  )
  return s;
};

async function insertTemporadas(serieId, temporadas){
  const temporada = await Temporada.findOneAndUpdate({serieId: serieId},
    {
      serieId,
      temporadas
    },
    {upsert: true},
    function (err, temporada) {
      if (err) console.error(error)
      return temporada;
    }
  ) 
  return temporada;
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
