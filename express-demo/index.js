const express = require('express');
const app = express();

const courses = [
    {id: 1, name: 'coursename'},
    {id: 2, name: 'coursename 2'},
    {id: 3, name: 'coursename 3'},
    {id: 4, name: 'coursename 4'},
]

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const desiredCourse = courses.find(c => c.id === parseInt(req.params.id))

    if(!desiredCourse)
        res.status(404).send('The course with the given ID could not be found');

    res.send(desiredCourse);
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