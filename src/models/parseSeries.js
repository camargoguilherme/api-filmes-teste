const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './series.json';
const urlFileTeste = './series-teste.json';
const Serie = require('../models/serieModel')
const Temporada = require('../models/temporadaModel')

exports.getSeries = async (link = 'https://tuaserie.com/') => {
  try {
    let response = await fetch(link);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let json = dom.window.document.querySelector('.columns').innerHTML;
    json = parse(json);
    
    for(i=1; i < json.length-1; i++){
      
      let titulo = json[i].children[0].children[0].attributes[0].value;
      titulo = titulo.replace(/&amp;/g, '\&');
      titulo = titulo.replace('Assistir', '').trim();
      let uriPage = json[i].children[0].attributes[0].value;
      let posterStart = json[i].children[0].children[0].attributes[1].value;
      let urlFileTemporada = titulo.replace(/\W+/g, '_');
      
      console.log("################################################")
      console.log(titulo+ " "+ i)
      serie = {
        titulo: titulo,
        uriPage: uriPage,
        posterStart: posterStart,
        path: urlFileTemporada,
        status: false,
        temporadas: 0
      }
      series = await insertSerie(serie);
    }
    return {message: "Series salvas no banco com sucesso"};
  } catch (error) {
    console.error(error);
  }
}

//let temporadas = await getTemporadas(uriPage, titulo);
//temporadaAux = await insertTemporadas(serieAux._id, temporadas)

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

exports.getTemporadas = async() => {
  let uri;
  let series = await Serie.find({status: false},{_id:1, titulo:1, uriPage:1}, function (err, series) {
    if (err) console.error(error)
    return series;
  });
  console.log(series)
  let serie;
  
    for(i=0; i<series.length; i++){
      serie = series[i];

      let response = await fetch(series[i].uriPage);
      let responseText = await response.text();
      let link = 'https://www.blogger.com/video-play.mp4?contentId=';
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
      uri = uri.replace(/(: <a href="[/])/g, '", "uri":"'+link);
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
  episodio.map( episodio=>{
    if(episodio.dublado){
      let ep ={};
      ep.titulo = episodio.titulo;
      ep.dublado = episodio.uri;
      episodios.push(ep);
    }    
  })
  episodio.map( (episodio)=>{
    if(index == episodios.length){
      let ep ={};
      ep.titulo = episodio.titulo;
      ep.legendado = episodio.uri;
      episodios.push(ep);
    }else{
      if(!episodio.dublado && episodios[index].titulo == episodio.titulo){
        episodios[index].legendado = episodio.uri;
        index++
      }   
    } 
  })
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
