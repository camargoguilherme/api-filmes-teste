const request = require('request');
const cheerio = require('cheerio')
const jsdom = require("jsdom");
const { JSDOM } = jsdom; 
const fs = require('fs');
const Filme = require('../models/filme');
const puppeteer = require('puppeteer');
const urlFile = './filmes.json';

class ParserFilmesHeadless{

  async getFilmes(req, res, next){
    const link = 'https://megaseriehd.com/filme'
    // for(let i = 2; i < 45; i++){
    //   this.getFilme(link, i);
    // }
    this.getPropsFilme('https://megaseriehd.com/series/sword-art-online-alternative-gun-gale-online/');
    res.json({message: 'Filmes Prontos'});
  }
  
  async getFilme(linkSite, pagina){
    try {
      let arrayUrlMovie = [];
      request(`${linkSite}/page/${pagina}/`, function (error, response, body) {
        if(response && response.statusCode == 200){
          var $ = cheerio.load(body)
          $('#archive-content > article').each( function (i, elem) {
            let urlMovie = $(this).children('.poster').children('a').attr().href;
            if(urlMovie){
              arrayUrlMovie.push(urlMovie)
            }
          });
        }
        console.log(`TOTAL DE FILMES: ${arrayUrlMovie.length}`)
  
        let index = 0;
        let iterar = true;
        let sleep = setInterval( () => {
          if(index == arrayUrlMovie.length){
            clearInterval(sleep);
          }
          if(iterar){
            iterar = false; 
            this.getPropsFilme(arrayUrlMovie[index])
            .then(run => {
              iterar = run;
            }); 
            index++;
          }
        }, 500);
        
      })
      
      
    } catch (error) {
      console.error(error);
    }
  } 
  
  async getPropsFilme(link){
      try{
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        //await page.setRequestInterception(true);
        
        /*page.on('request', (request) => {
          if (request.resourceType() === 'document') {
            request.continue();
          } else {
            request.abort();
          }
        });
        */
        await page.goto(link);
  
        let props = await page.evaluate(() => {

          let titulo = document.querySelector('div.sheader > div.data > h1').innerText;
          let posterStart = document.querySelector('div.poster').innerHTML;
          let categoria = document.querySelector('div.sgeneros').innerText.split('\n');
          let resumo = document.querySelector('#info > div > p').innerText;
  
          return {
            titulo,
            posterStart,
            categoria,
            resumo
          }
  
        });
        console.log(props)
        let countLinks = await page.evaluate(() => {
          return document.querySelector('#playeroptionsul').childElementCount;
        });
        console.log(`PREPARANDO FILME: '${props.titulo}'`);
        
        let links = [];
        
        for(i = 1; i < countLinks; i++){
          let player = `#player-option-${i}`;
          
          let titles = await page.evaluate(() => {
            let title = [];
            let div = document.getElementById("playeroptionsul");
            let spans = div.getElementsByClassName("title");
          
            for(i=0;i<spans.length;i++){
              title.push(spans[i].innerHTML);
            }
            return title;
          });
  
          await page.waitFor(player);
          await page.click(player);
          
          await page.waitFor('div.pframe');
          let link = await page.evaluate(() => {
            return document.querySelector('div.pframe').innerHTML;
          });
  
          links.push({title: `${titles[i]}`, uri: `${urlify(link)}`});
          await page.waitFor(10000);
        }
        
        
        let filme = props;
        filme.uri = links;
        filme.posterStart = imgUrlify(filme.posterStart);
        //console.log(JSON.stringify(filme, null, '\t'));
        insertFilme(filme);
        browser.close();
      } catch (error) {
        console.error(error);
        browser.close();
        
      }
    //});
    return true
  }
  
  insertFilme(filme){
    
    Filme.findOneAndUpdate({titulo: filme.titulo},
      filme,
      {upsert: true},
      function (err, filme) {
        if (err) console.error(err)
        return filme;
      }
    ).then()
  };
  
  async getFilme(url){
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
  urlify(text = '') {
    if(text.length == 0) return;
    
    var urlRegex = /(?:(?:https?|ftp):\/\/)(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
    return text.match(urlRegex);;
  }
  
  urlify2(links = []) {
    if(links.length == 0) return;
    
    var urlRegex = /(?:(?:https?|ftp):\/\/)(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
      
    links.map( link =>{
      console.log(link);
      link.title = link.title ? link.title.toUpperCase() : "DUB / LEG";
      link.uri = link.uri ? link.uri.match(urlRegex) : "OPS!!!";
      
    })
    return links;
  }
  
  imgUrlify(text){
    var urlRegex = /((https):\/\/)(([^\s()<>]+|\((?:[^\s()<>]+|(\([^\s()<>]+\)))?\))+(?:\(([^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
    let aux =  text.match(urlRegex)
    if(aux)
      aux = aux[0]
    return aux;
  }
  
  writeFile(path, data){
    fs.writeFileSync(path, data,function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
  }
  
  readFile(path){
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
}

module.exports = new ParserFilmesHeadless();