const mongoose = require('mongoose');

const FilmeSchema = mongoose.Schema({
    titulo: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    uri: Array,
    referer: String,
    uriPage: String,
    resumo: String,
    posterStart: String,
    categoria: Array,
    new: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Filme', FilmeSchema);