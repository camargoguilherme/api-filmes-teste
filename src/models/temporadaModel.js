const mongoose = require('mongoose');

const TemporadaSchema = mongoose.Schema({
    serieId: String,
    temporadas: []
}, {
    timestamps: true
});

module.exports = mongoose.model('Temporada', TemporadaSchema);