const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');

//Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
    .then(() => debug('Connected to the database...'))
    .catch(err => debug('Could not connect to db', err));

const app = express();
app.use(express.json()); //Parse requests as JSON

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    debug(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

