const mongoose = require('mongoose');

const TemporadaSchema = mongoose.Schema({
    title: String,
		episodios:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Episodio'
		}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Temporada', TemporadaSchema);