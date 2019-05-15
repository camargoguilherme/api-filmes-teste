const mongoose = require('mongoose');

const EpisodioSchema = mongoose.Schema({
  title: String,
  uri: String,
  uriVideo: String,
  dublado: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model('Episodio', EpisodioSchema);