const mongoose = require('mongoose');

const EpisodioSchema = mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim: true
  },
  uri: String,
  dublado: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model('Episodio', EpisodioSchema);