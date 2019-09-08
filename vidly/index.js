require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');
const error = require('./middleware/error');

const connectionString = 'mongodb://localhost/vidly';
winston.add(new winston.transports.File({filename: 'logfile.log'}));
winston.add(new winston.transports.MongoDB({
    db: connectionString,
    level: 'error'
}));

//Only works in sychronous code
process.on('uncaughtException', ex => {
    winston.error(ex.message, {metadata: ex});
    process.exit(1);
})

//Only works in async code (aka promises)
process.on('unhandledRejection', ex => {
    winston.error(ex.message, {metadata: ex});
    process.exit(1);
})

// var p = Promise.reject(new Error('An error ocurred on this promise'));
// p.then(() => console.log('DONE'));

//Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

if (!config.get('jwtPrivateKey')) {
    debug('FATAL ERROR: JWT Private Key not defined');
    process.exit(1);
}

mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
    .then(() => debug('Connected to the database...'))
    .catch(err => debug('Could not connect to db', err));

const app = express();
app.use(express.json()); //Parse requests as JSON

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    debug(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

