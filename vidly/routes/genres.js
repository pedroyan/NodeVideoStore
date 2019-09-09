const express = require('express');
const {Genre, validate} = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

//Get all genres
router.get('/', async (req, res) => {
    res.send(await Genre.find().sort('name'));
});

//Get specific genre
router.get('/:id', validateObjectId,async (req, res) => {
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
    } catch (err) {
        res.send(err.errors[0].message);
    }

    const result = await newGenre.save();
    res.send(result);
});

//Update a Genre
router.put('/:id', [auth, validateObjectId], async (req, res) => {
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

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    res.send(genre);
});

module.exports = router;