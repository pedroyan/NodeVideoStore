const mongoose = require('mongoose');
const config = require('config');
const connectionString = 'mongodb://localhost/vidly';
const debug = require('debug')('app:startup');

module.exports = function () {
    mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => debug('Connected to the database...'))
        .catch(err => debug('Could not connect to db', err));
}