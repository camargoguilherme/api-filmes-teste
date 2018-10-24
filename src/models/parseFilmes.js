const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './filmes.json';

exports.getFilmes = async (href = 'http://gofilmes.me/', genero = null, pagina = '1') => {
  console.log('getFilmes')

  if(genero != null){
    genero = `genero/${genero}`
  }else{
    genero = ''
  }

  pagina = `?p=${pagina}`
  let url = `${href}${genero}${pagina}`
  console.log('url: '+ url)
  try {
    
    let response = await fetch(url);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let fil = dom.window.document.querySelectorAll('.poster');
    


    let filmes = new Array();
    
    console.log(JSON.stringify(fil))
    
    fil.forEach(element => {
      element = parse(element.innerHTML);
      
      filme = {
        // id
        id:  element[1].attributes[0].value,
        // Titulo do Filme
        titulo: element[0].children[2].children[0].content,
        uri: 'uri',
        // Link para o filme
        uriPage: element[0].attributes[0].value,
        resumo: 'resumo',
        img: 'img',
        // Link para poster
        posterStart: element[0].children[0].attributes[1].value,
      }

      teste = ` ${element[1].attributes[0].value}  = {
        id:  ${element[1].attributes[0].value},
        titulo: ${element[0].children[2].children[0].content},
        uri: 'uri',
        uriPage: ${element[0].attributes[0].value},
        resumo: 'resumo',
        img: 'img',
        posterStart: ${element[0].children[0].attributes[1].value},
      }`
      console.log('teste');
      console.log(JSON.stringify(teste));
      filmes.push(filme);
    });
    
    /** outro site
    fil.forEach(element => {
      filme = {
        // id
        id: element.attributes[0].value,
        // Titulo do Filme
        titulo: element.children[0].children[1].children[0].attributes[1].value.replace('Assistir', '').trim(),
        uri: 'uri',
        // Link para o filme
        uriPage: element.children[0].children[1].attributes[0].value,
        resumo: 'resumo',
        img: 'img',
        // Link para poster
        posterStart: element.children[0].children[1].children[0].attributes[0].value,
      }
      console.log(filme);
      filmes.push(filme);
    });
     */
   
    writeFile(urlFile, JSON.stringify(filmes));
   
    return filmes;
  } catch (error) {
    console.error(error);
  }
}

exports.getFilme = async (url) => {
  console.log('getFilme')
  try {
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

    descricao = parse(descricao);

    filme.resumo = descricao[3].children[5].children[2].content;
    filme.uri = await getMovieURL( links );
    filme.img = urlify(links[0].substring(5 , links[0].length), true);

    return filme;
  } catch (error) {
    console.error(error);
  }
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
