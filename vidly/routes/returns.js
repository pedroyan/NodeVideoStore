const express = require('express');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rentals');
const { Movie } = require('../models/movies');
const Fawn = require('fawn');
const debug = require('debug')('app:rentals');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');


const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOne({ 'customer._id': req.body.customerId, 'movie._id': req.body.movieId });
    if (!rental) return res.status(404).send('Could not find provided rental');

    if (rental.returnDate) {
        return res.status(400).send('Rental already processed');
    }

    await new Fawn.Task()
        .update('rentals', { _id: rental._id }, { $set: { returnDate: Date.now() } })
        .update('movies', { _id:  mongoose.Types.ObjectId(req.body.movieId)}, { 
            $inc: { numberInStock: 1 } 
        }).run();

    res.send(200);
});

module.exports = router;