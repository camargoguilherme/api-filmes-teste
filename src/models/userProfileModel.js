var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
  idUser: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  favoritos:{
    filmes:[],
    series:[]
  },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);