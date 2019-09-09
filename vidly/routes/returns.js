const express = require('express');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rentals');
const Fawn = require('fawn');
const debug = require('debug')('app:rentals');
const mongoose = require('mongoose');
const moment = require('moment');
const validateMiddleware = require('../middleware/validateMiddleware');


const router = express.Router();

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
    if (!rental) return res.status(404).send('Could not find provided rental');

    if (rental.returnDate) {
        return res.status(400).send('Rental already processed');
    }

    const currentMoment = moment();
    const rentalFee = currentMoment.diff(rental.rentalDate, 'days') * rental.movie.dailyRentalRate;

    console.log('Resulting fee', rentalFee);

    const taskResults = await new Fawn.Task()
        .update('rentals', { _id: rental._id }, {
            $set: {
                returnDate: Date.now(),
                rentalFee: rentalFee
            }
        }).update('movies', { _id: mongoose.Types.ObjectId(req.body.movieId) }, {
            $inc: { numberInStock: 1 }
        }).run();

    
    const refreshedRental = await Rental.findById(rental._id);
    res.status(200).send(refreshedRental);
});

module.exports = router;