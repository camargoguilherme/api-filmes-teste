const request = require('request');
const cheerio = require('cheerio')
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const fs = require('fs')
const urlFile = './filmes.json';

exports.getFilmes = (link = 'http://gofilmes.me/', genero = null, pagina = '1') => {
  console.log('getFilmes')

  if(genero != null){
    genero = `genero/${genero}`
  }else{
    genero = ''
  }

  pagina = `?p=${pagina}`
  let url = `${link}${genero}${pagina}`
  console.log('url: '+ url)
  try {
    let filmes = new Array();
    request(link, function (error, response, body) {
      if(response && response.statusCode == 200){
        var $ = cheerio.load(body)
        
        $('.poster').each( function(i, elem) {

        filme = {
          // Titulo do Filme
          titulo: $(this).children('a').children('img').attr().alt,
          uri: 'uri',
          // Link para o filme
          uriPage: $(this).children('a').attr().href,
          resumo: 'resumo',
          img: 'img',
          // Link para poster
          posterStart: $(this).children('a').children('img').attr().src,
        }

        filmes.push(filme);
          
        });
        
        //writeFile(urlFile, JSON.stringify(filmes));
      }
      return filmes;
    });
  } catch (error) {
    console.error(error);
  }
}

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

async function getImgURL(href) {
  console.log('getImgURL')
  try {
    let response = await fetch(href);
    let responseText = await response.text();

    //responseText = JSON.parse(readFileSync('teste.html')); 

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
  console.log('getMovieURL')
 
  try {
    let response = await fetch(href);
    let responseText = await response.text();
    
    const dom = new JSDOM(responseText);
    let links = dom.window.document.querySelector('.align').innerHTML;

    let uris = urlify(links);
    return uris;
  } catch (error) {
    console.error(error);
  }
}

function urlify(text, img = false) {
  var urlRegex = /(?:(?:https?|ftp):\/\/)(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g
  var urlRegexImg = /(https?:\/\/.*\.(?:png|jpg))/g;
  let aux = text.match(urlRegex);
  if(img)
    aux = text.match(urlRegexImg);
    
  console.log(aux)
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
