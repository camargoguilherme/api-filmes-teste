const mongoose = require('mongoose');

const FilmeSchema = mongoose.Schema({
    titulo: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    uri: {},
    uriPage: String,
    resumo: String,
    posterStart: String,
    categoria: Array,
    status: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Filme', FilmeSchema);