const asyncMiddleware = require('../middleware/async');
const express = require('express');
const {Genre, validate} = require('../models/genres');
const debug = require('debug')('app:genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')

const router = express.Router();

//Get all genres
router.get('/', asyncMiddleware(async (req, res) => {
    throw new Error('lol');
    res.send(await Genre.find().sort('name'));
}));

//Get specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    return res.send(genre);
});

//Create a Genre
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newGenre = new Genre({
        name: req.body.name
    });

    try {
        await newGenre.validate();
        const result = await newGenre.save();
        res.send(result);
    } catch (err) {
        debug('Failed to create new genre in the database', err);
        res.send(err.errors[0].message);
    }
});

//Update a Genre
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true, upsert: false });

    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    res.send(genre);
});

module.exports = router;