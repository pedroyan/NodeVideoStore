const express = require('express');
const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genres');
const debug = require('debug')('app:movies');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(`Could not find a Genre with ID ${req.body.genreId}`)

    var movie = new Movie({
        title: req.body.title,
        genre: { //By setting the genre like this instead of (genre: genre) selectively applies just the _id and name properties on this nested document
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

router.get('/', async (req, res) => {
    res.send(await Movie.find());
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(400).send(`Could not find a Genre with ID ${req.body.genreId}`)

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.params.id) return res.status(404).send(`An ID must be provided to update a movie`);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(`Could not find a Genre with ID ${req.body.genreId}`)

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: { //By setting the genre like this instead of (genre: genre) selectively applies just the _id and name properties on this nested document
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(400).send(`Could not find a movie with ID ${req.params.id}`)
    res.send(movie);
})

module.exports = router;