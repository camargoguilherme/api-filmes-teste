const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
  type: String,
  title: String,
  error: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Log', LogSchema);