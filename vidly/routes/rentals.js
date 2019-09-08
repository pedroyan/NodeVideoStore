const express = require('express');
const { Rental, validate } = require('../models/rentals');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const debug = require('debug')('app:rentals');

Fawn.init(mongoose);

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(`Could not find a Customer with ID ${req.body.genreId}`);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(`Could not find a Movie with ID ${req.body.genreId}`);

    if (movie.numberInStock === 0) return res.status(400).send(`Movie not available`);
    
    const rental = new Rental({
        customer: customer, //Only the schema defined properties will be passed along
        movie: movie,
        returnDate: req.body.returnDate
    });

    try {
        //In MongoDB, there is no such thing as a Transaction, like in SQL.
        //But there is a concept called two phase commit:
        //https://docs.mongodb.com/v3.4/tutorial/perform-two-phase-commits/

        //In this project, we will be using an NPM package that abstracts this two phase
        //commit to something akin to a transaxtion, as shown below.
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {
            $inc: {numberInStock: -1}
        }).run();

        res.send(rental);
    } catch (err) {
        res.status(500).send('Something Failed');
    }
})

router.get('/', async (req, res) => {
    res.send(await Rental.find());
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(400).send(`Could not find a Rental with ID ${req.body.genreId}`)

    res.send(rental);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(`Could not find a Customer with ID ${req.body.genreId}`);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(`Could not find a Movie with ID ${req.body.genreId}`);

    const setDefinitions = {
        customer: customer,
        movie: movie,
        returnDate: req.body.returnDate
    }

    if (req.body.rentalDate) {
        setDefinitions.rentalDate = req.body.rentalDate;
    }

    try {
        const rental = await Rental.findByIdAndUpdate(req.params.id,
            { $set: setDefinitions }, { new: true });
        res.send(rental);
    } catch (error) {
        for (const err in error.errors) {
            debug('Could not update rental on database: ', err.errors[error].message);
        }
        res.send(err)
    }
});


router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(400).send(`Could not find a rental with ID ${req.params.id}`)
    res.send(rental);
})

module.exports = router;