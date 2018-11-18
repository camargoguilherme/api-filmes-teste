const mongoose = require('mongoose');

const FilmeSchema = mongoose.Schema({
    titulo: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    uri: String,
    uriPage: String,
    resumo: String,
    img: String,
    posterStart: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Filme', FilmeSchema);