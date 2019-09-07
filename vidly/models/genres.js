const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    }
});

const Genre = mongoose.model('Genre', genreSchema);

const genreJoiSchema = {
    name: Joi.string().min(3).required()
}

function validateGenre(genre) {
    return Joi.validate(genre, genreJoiSchema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.schema = genreSchema;
