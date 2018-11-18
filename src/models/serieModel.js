const mongoose = require('mongoose');

const SerieSchema = mongoose.Schema({
    titulo:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    path: String,
    posterStart: String,
    uriPage: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Serie', SerieSchema);