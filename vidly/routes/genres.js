const Joi = require('joi');
const express = require('express');
const debug = require('debug')('app:genres');
const router = express.Router();
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    }
}));

const genreJoiSchema = {
    name: Joi.string().min(3).required()
}

//Get all genres
router.get('/', async (req, res) => {
    res.send(await Genre.find().sort('name'));
});

//Get specific genre
router.get('/:id', async (req, res) => {
    try{
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);
    
        return res.send(genre);
    }catch(err){
        debug(`An erro ocurred while looking for specific genre ${req.params.id}`, err)
    }
});

//Create a Genre
router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
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
router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true, upsert: false });

    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);
    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    res.send(genre);
});

function validateGenre(genre) {
    return Joi.validate(genre, genreJoiSchema);
}

module.exports = router;