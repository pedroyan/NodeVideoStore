const genres = require('./genres');
const mongoose = require('mongoose');
const Joi = require('joi');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    genre: {
        type: genres.schema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
}));


function validateMovie(movie) {

    const movieJoiSchema = {
        title: Joi.string().required(),
        genreId: Joi.objectId().required(), //ID to genre
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    }

    return Joi.validate(movie, movieJoiSchema);
}

exports.Movie = Movie;
exports.validate = validateMovie;