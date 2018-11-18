var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
  idUser: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  favoritos:[
    {
      id: idfavorito,
      filmes: [true, false],
    }    
  ],
  seekfilmes:[
    {
      id: idfilme,
      seek: seekFilme
    }
  ],

  seekseries: [
    {
      id: idSerie,
      indexSerie: indexSerie,
      indexEpisodio: indexEpisodio 
    }
  ]


});

module.exports = mongoose.model('UserProfile', UserProfileSchema);