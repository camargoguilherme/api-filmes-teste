const mongoose = require('mongoose');

const SerieSchema = mongoose.Schema({
    title: String,
    uriPage: String,
    posterStart: String,
    resume: String,
    status: Boolean,
    temporadas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temporada'
    }],
    category:[{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Serie', SerieSchema);