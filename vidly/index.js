const express = require('express');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useFindAndModify: false})
    .then(() => debug('Connected to the database...'))
    .catch(err => debug('Could not connect to db', err));

const app = express();
app.use(express.json()); //Parse requests as JSON
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    debug(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});