const mongoose = require('mongoose');

const TemporadaSchema = mongoose.Schema({
    serieId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    temporadas: []
}, {
    timestamps: true
});

module.exports = mongoose.model('Temporada', TemporadaSchema);