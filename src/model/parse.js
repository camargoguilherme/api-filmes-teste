const fetch = require("node-fetch");4
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const {parse} = require('himalaya');
const fs = require('fs')
const urlFile = './filmes.txt';

exports.parseHTML = (href) => {

  fetch('https://xilften.co/filme/').then(
    (response) => {
      response.text().then( (result) => { 
        const dom = new JSDOM(result);
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
            // Link para poster
            posterStart: element.children[0].children[1].children[0].attributes[0].value,
          }

          filmes.push(filme);
        });

        fs.writeFileSync(urlFile, JSON.stringify(filmes),function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch((error) => {
      console.error(error);
    });
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