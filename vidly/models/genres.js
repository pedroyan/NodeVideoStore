const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    }
}));

const genreJoiSchema = {
    name: Joi.string().min(3).required()
}

function validateGenre(genre) {
    return Joi.validate(genre, genreJoiSchema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
