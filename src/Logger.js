const fs = require('fs');

exports.writeFile = (log) => {
  let extension = '.log';
  
  let d = new Date();
  let months = ["Janeiro", "Fevereiro", "Março", 
                "Abril", "Maio", "Junho", 
                "Julho", "Agosto", "Setembro", 
                "Outubro", "Novembro", "Dezembro"];

  let date =  d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear();
  let hours =  d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
  let dateFully = date + '-' + hours;
  let fileName = 'log-'+date+extension;
  let newData = '\n\n'+ dateFully + '\n' + log;

  fs.readFile('../log/'+fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile('../log/'+fileName, data+log);
    
  });
}



