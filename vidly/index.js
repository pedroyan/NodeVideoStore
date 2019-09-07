const express = require('express');
const genres = require('./routes/genres');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useFindAndModify: false})
    .then(() => debug('Connected to the database...'))
    .catch(err => debug('Could not connect to db', err));

const app = express();
app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    debug(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});