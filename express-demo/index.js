const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send([1,2,3,4,5]);
});

app.get('/api/courses/:year/:month', (req, res) => {
    var toReturn = {
        query: req.query, //Stores the querystring parameters
        routeParams: req.params //Store the route parameters
    }
    res.send(toReturn);
});

const port = process.env.NODEPORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});