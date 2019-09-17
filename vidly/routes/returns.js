const express = require('express');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rentals');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const validateMiddleware = require('../middleware/validateMiddleware');


const router = express.Router();

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
    if (!rental) return res.status(404).send('Could not find provided rental');

    if (rental.returnDate) {
        return res.status(400).send('Rental already processed');
    }

    rental.return();

    const taskResults = await new Fawn.Task()
        .update('rentals', { _id: rental._id }, {
            $set: rental
        }).update('movies', { _id: mongoose.Types.ObjectId(req.body.movieId) }, {
            $inc: { numberInStock: 1 }
        }).run();

    
    const refreshedRental = await Rental.findById(rental._id);
    res.send(refreshedRental);
});

module.exports = router;