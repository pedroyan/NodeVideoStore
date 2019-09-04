const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

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

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    console.log(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Get all genres
app.get('/api/genres', (req, res) =>{
    res.send(genres);
});

//Get specific genre
app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    return res.send(genre);
});

//Create a Genre
app.post('/api/genres', (req, res) => {
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
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);

    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Could not find any genre with the id ${req.params.id}`);
    
    genres.splice(genres.indexOf(genre), 1);

    res.send(genre);
});

function validateGenre(genre){
    const genreSchema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, genreSchema);
}
