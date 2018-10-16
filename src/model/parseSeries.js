const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './series.json';

exports.getSeries = (href) => {
  let link = 'https://tuaserie.com/';
  let link2 = 'https://www.tuaserie.com/3151521e0c6f85fd';
  let link3 = 'https://www.blogger.com/video-play.mp4?contentId=3151521e0c6f85fd';
  getSeries(link);
  //getTemporadas(link2);
  //getMovieURL(link2);
  var series = readFile(urlFile);
  
  return series;
}

exports.getTemporadas = (link, path) => {
  path = `./temporadas/${ path }.json`;
  getTemporadas(link, path)
  let temporada = readFile(path);
  return temporada;
}

async function getSeries(link) {
  try {
    let response = await fetch(link);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let json = dom.window.document.querySelector('.columns').innerHTML;
    json = parse(json);
    let series = new Array();
    console.log(json.length)
    for(i=1; i < json.length; i++){
      
      let titulo = json[i].children[1].children[0].attributes[0].value;
      let uriPage = json[i].children[1].attributes[0].value;
      let posterStart = json[i].children[1].children[0].attributes[1].value;
      let urlFileTemporada = titulo.replace(/\W+/g, '_');
      //await getTemporadas(uriPage, 'temporadas/'+urlFileTemporada+'.json')
      serie = {
        // Titulo da Serie
        titulo: titulo.replace('Assistir', '').trim(),
        // Link para Serie
        uriPage: uriPage,
        // Link para poster
        posterStart: posterStart,
        path : urlFileTemporada
      }
      
      series.push(serie);
      i++
    }    
    writeFile(urlFile, JSON.stringify(series));

    return series;
  } catch (error) {
    console.error(error);
  }
}

async function getTemporadas(href, path) {
  try {
    let response = await fetch(href);
    let responseText = await response.text();
    let link = 'https://www.blogger.com/video-play.mp4?contentId=';
    const dom = new JSDOM(responseText);
    let uri = dom.window.document.querySelector('#preview').innerHTML;
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
    uri = uri.replace(/(: <a href="[/])/g, '", "link":"'+link);
    uri = uri.replace(/(>)/g, ', "dublado": ');
    uri = uri.replace(/(DUBLADO)/g, 'true }');
    uri = uri.replace(/(LEGENDADO)/g, 'false }');
    uri = uri.replace(/(, {+)/g, ']}, {');
    uri = '#' + uri.trim() + ']}]';
    uri = uri.replace(/(#]},)/g, '[');
    json = JSON.stringify(uri);

    let temporadas = JSON.parse(json);
    writeFile(path, JSON.stringify(temporadas));
    return temporadas;
  } catch (error) {
    console.error(error);
  }
}

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
