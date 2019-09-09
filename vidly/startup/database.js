const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:startup');

module.exports = function () {
    const cs = config.get('connectionString');
    mongoose.connect(cs, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => debug(`Connected to the database ${cs}...`))
        .catch(err => debug('Could not connect to db', err));
}