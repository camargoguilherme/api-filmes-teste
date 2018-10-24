const mongoose = require('mongoose');

const SerieSchema = mongoose.Schema({
    titulo: String,
    path: String,
    posterStart: String,
    uriPage: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Serie', SerieSchema);