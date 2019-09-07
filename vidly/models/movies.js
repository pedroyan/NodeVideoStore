const genres = require('./genres');
const mongoose = require('mongoose');
const Joi = require('joi');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    genre:{
        type: genres.schema,
        required: true
    },
    numberInStock:{
        type: Number,
        default: 0,
    },
    dailyRentalRate:{
        type: Number,
        default: 0
    }
}));

const movieJoiSchema = {
    title: Joi.string().required(),
    genreId: Joi.strict().required(), //ID to genre
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
}

function validateMovie(movie){
    return Joi.validate(movie, movieJoiSchema);
}

exports.Movie = Movie;
exports.validate = validateMovie;