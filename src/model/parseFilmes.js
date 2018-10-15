const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './filmes.json';

exports.parseHTML = (href) => {
  let link = 'https://xilften.co/filme/assistir-errementari-o-ferreiro-e-o-diabo-dublado-online/';
  getFilmes(link);
  
  var filmes = JSON.parse(readFile(urlFile));
  return filmes;
}

async function getFilmes() {
  try {
    let response = await fetch('https://xilften.co/filme/');
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let json = dom.window.document.querySelector('#archive-content').innerHTML;
    let fil = parse(json);
    let filmes = new Array();
    
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
     
      filmes.push(filme);
    });
    for(i = 0; i < filmes.length; i++){
      aux = await getFilme(filmes[i].uriPage);
      filmes[i].resumo = aux.resumo;
      filmes[i].uri = aux.uri;
      filmes[i].img = aux.img;
    }
    
    writeFile(urlFile, JSON.stringify(filmes));

    return filmes;
  } catch (error) {
    console.error(error);
  }
}

async function getFilme(href) {
  try {
    let response = await fetch(href);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let uri = parse(dom.window.document.querySelector('.playex').innerHTML);
    
    let res = parse(dom.window.document.querySelector('#info').innerHTML);
    //let img = parse(dom.window.document.querySelector('#olvideo').innerHTML);
    
    let filme = new Array();
    filme.resumo = res[1].children[0].children[0].content;
    //filme.img = await getImgURL( uri[0].children[1].attributes[1].value );
    //filme.uri = await getMovieURL( uri[0].children[1].attributes[1].value );
    uris = urlify(JSON.stringify(uri));
    return filme;
  } catch (error) {
    console.error(error);
  }
}

async function getImgURL(href) {
  
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

function urlify(text) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)]$)/g;
  //var urlRegex = /(https?:\/\/[^\s]+)/g;
  
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
        console.error(err);
        return err;
      }
      return data;
    });
  }
  return data;
}
