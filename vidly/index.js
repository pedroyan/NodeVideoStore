const express = require('express');
const genres = require('./routes/genres');

const app = express();
app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.NODEPORT || 7345;
app.listen(port, () => {
    console.log(`App listening on por ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});