const mongoose = require('mongoose');

const FilmeSchema = mongoose.Schema({
    id: String,
    titulo: String,
    uri: String,
    uriPage: String,
    resumo: String,
    img: String,
    posterStart: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Filme', FilmeSchema);