const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger')
const authenticator = require('./authenticator');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Server Password: ${config.get('mail.password')}`);


//NOTE: The inclusion order of the middlewares matter
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //Serves files statically
app.use(helmet());
if (app.get('env') === 'development'){
    console.log('Morgan enabled...')
    app.use(morgan('tiny'));
}
app.use(authenticator);



const port = process.env.NODEPORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

const courses = [
    { id: 1, name: 'coursename' },
    { id: 2, name: 'coursename 2' },
    { id: 3, name: 'coursename 3' },
    { id: 4, name: 'coursename 4' },
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const desiredCourse = courses.find(c => c.id === parseInt(req.params.id))

    if (!desiredCourse)
        res.status(404).send('The course with the given ID could not be found');

    res.send(desiredCourse);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send({
        query: req.query, //Stores the querystring parameters
        routeParams: req.params //Store the route parameters
    });
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    let toUpdate = courses.find(c => c.id === parseInt(req.params.id));
    if (!toUpdate) return res.status(404).send(`Could not find any course with id ${req.params.id}`);

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    toUpdate.name = req.body.name;

    res.send(toUpdate);
});

app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Could not find any course with id ${req.params.id}`);

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const courseSchema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, courseSchema);
}