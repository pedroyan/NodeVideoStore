const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
    {name: 'Horror', id: 1},
    {name: 'Comedy', id: 2},
    {name: 'Action', id: 3},
    {name: 'Adventure', id: 4},
    {name: 'Kids', id: 5},
]

const genreSchema = {
    name: Joi.string().min(3).required()
}

//Get all genres
router.get('/', (req, res) =>{
    res.send(genres);
});

//Get specific genre
router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    return res.send(genre);
});

//Create a Genre
router.post('/', (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    };

    genres.push(newGenre);
    res.send(newGenre);
});

//Update a Genre
router.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);
    
    genres.splice(genres.indexOf(genre), 1);

    res.send(genre);
});

function validateGenre(genre){
    return Joi.validate(genre, genreSchema);
}

module.exports = router;