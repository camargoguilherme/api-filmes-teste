const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './filmes.json';

exports.parseHTML = (href) => {
  let link = 'https://xilften.co/filme/assistir-o-ultimo-assalto-dublado-online/';
  getFilmes(link);

  var filmes = '';
  filmes = fs.readFileSync(urlFile, 'utf8', function (err,data) {
      if (err) {
        return console.error(err);
      }
      console.log('Readed!');
      return JSON.parse(data);
    });
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
    

    fs.writeFileSync(urlFile, JSON.stringify(filmes),function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
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
    filme.img = await getImg(uri[0].children[1].attributes[1].value);
    filme.uri = uri[0].children[1].attributes[1].value;
    uris = urlify(JSON.stringify(uri));
    return filme;
  } catch (error) {
    console.error(error);
  }
}

async function getImg(href) {
  try {
    let response = await fetch(href);
    let responseText = await response.text();

    const dom = new JSDOM(responseText);
    let img = parse(dom.window.document.querySelector('#videojs_html5_api').innerHTML);
    uris = urlify(JSON.stringify(img));
    return uris;
  } catch (error) {
    console.error(error);
  }
}

function urlify(text) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+[(.jpg)|(.png)|(.mp4)]$)/g;
  //var urlRegex = /(https?:\/\/[^\s]+)/g;
  
  let uri = ''+ text.match(urlRegex)
  let uri2 = uri.substring(0,4+uri.search(/(.jpg)|(.png)|(.mp4)/g))
  console.log(text);
  return uri2;
}