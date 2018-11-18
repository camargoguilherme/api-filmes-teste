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
    let series = new Array();
    for(i=1; i < json.length-1; i++){
      
      let titulo = json[i].children[0].children[0].attributes[0].value;
      let uriPage = json[i].children[0].attributes[0].value;
      let posterStart = json[i].children[0].children[0].attributes[1].value;
      let urlFileTemporada = titulo.replace(/\W+/g, '_');
      //await getTemporadas(uriPage, 'temporadas/'+urlFileTemporada+'.json')
      
      console.log("################################################")
      console.log(titulo+ " "+ i)
      //appendFile(urlFileTeste, JSON.stringify(serie));
      //console.log(series.length)
      serie = {
        // Titulo da Serie
        titulo: titulo.replace('Assistir', '').trim(),
        // Link para Serie
        uriPage: uriPage,
        // Link para poster
        posterStart: posterStart,
        path: urlFileTemporada,
      }
      let temporadas = await getTemporadas(uriPage, titulo);

      //serieAux = await insertSerie(serie);
      //temporadaAux = await insertTemporadas(serieAux._id, temporadas)
      serie.temporadas = temporadas;
      series.push(serie);
    }
    return series;
  } catch (error) {
    console.error(error);
  }
}

exports.getPreparar = async (urls) => {
  let temporadas = '';
  try {
    for(i=0; i < urls.length; i++){ 
      console.log(urls[i].uriPage)
      let response = await fetch(urls[i].uriPage);
      let responseText = await response.text();

      let link = 'https://www.blogger.com/video-play.mp4?contentId=';
      const dom = new JSDOM(responseText);
      let uri = dom.window.document.querySelector('#preview > div > div > header').innerHTML;
      
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
      uri = uri.replace(/(DUBLADO)/g, 'true }');
      uri = uri.replace(/(LEGENDADO)/g, 'false }');
      uri = uri.replace(/(, {+)/g, ']}, {');
      uri = '#' + uri.trim() + ']}]';
      uri = uri.replace(/(#]},)/g, '[');
      //writeFile(`./temporada-teste/${path}.json`, teste);
      temporadas += uri;
    }
    //writeFile(urlFileTeste, JSON.stringify(temporadas));
    console.log(temporadas.length)
    return js;
  } catch (error) {
    console.error(error);
  }
}

async function getTemporadas(url, titulo){
  let uri;
  try {
    let response = await fetch(url);
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
    uri = uri.replace(/&/g, '\&');
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
    temporadas.forEach(temp => {
      temp.titulo = temp.titulo.replace(titulo, '').trim();
      temp.episodio = getEpisodio(temp.episodio);
      temporadasAux.push(temp); 
    });asd
    temporadas = JSON.parse(uri);
    return temporadas
  } catch (error) {
    console.error(error);
  }
}

function getEpisodio(episodio){
  let episodios = new Array();
  
  for(i=0; i<0; i++){
    /*ep = {
      titulo: null,
      dublado: null,
      legendado: null
    }
    
    if(episodio[i-1].titulo == episodio[i].titulo){
      ep.titulo = episodio[i-1].titulo;
      ep.dublado = { uri: episodio[i-1].uri }
      ep.legendado = { uri: episodio[i].uri }
    }else{
      ep.titulo = episodio[i].titulo;
      ep.dublado = null;
      ep.legendado = { uri: episodio[i].uri }
    }
    episodios.push(ep);*/
  }
  return null;
}

async function createSeries(data){
  // Create a Serie
  const serie = new Serie({
    titulo: data.titulo || "Untitled Serie",
    path: data.path,
    posterStart: data.posterStart,
    uriPage: data.uriPage,
    temporadas:[]
  });

  // Save Serie in the database
  return await serie.save()
  /*.then(data => {
    serieData = data;
  }).catch(err => {
      return {message: err.message || "Some error occurred while creating the Serie."};

  })*/
}

async function createTemporadas(serieId, temporadas){
  // Create a Temporada
  const temporada = new Temporada({
    serieId: serieId,
    temporadas: temporadas
  });

  // Save Temporada in the database
  return await temporada.save()
  /*.then(data => {
    return JSON.parse(data);
  }).catch(err => {
    return {message: err.message || "Some error occurred while creating the Temporada."};
  });*/
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
