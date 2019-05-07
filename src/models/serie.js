const mongoose = require('mongoose');

const SerieSchema = mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    posterStart: String,
    resume: String,
    status: Boolean,
    seaseons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temporada'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Serie', SerieSchema);