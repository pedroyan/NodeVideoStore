const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
    { id: 1, name: 'coursename' },
    { id: 2, name: 'coursename 2' },
    { id: 3, name: 'coursename 3' },
    { id: 4, name: 'coursename 4' },
]

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const desiredCourse = courses.find(c => c.id === parseInt(req.params.id))

    if (!desiredCourse)
        res.status(404).send('The course with the given ID could not be found');

    res.send(desiredCourse);
});

router.get('/:year/:month', (req, res) => {
    res.send({
        query: req.query, //Stores the querystring parameters
        routeParams: req.params //Store the route parameters
    });
});

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
});

router.put('/:id', (req, res) => {
    let toUpdate = courses.find(c => c.id === parseInt(req.params.id));
    if (!toUpdate) return res.status(404).send(`Could not find any course with id ${req.params.id}`);

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    toUpdate.name = req.body.name;

    res.send(toUpdate);
});

router.delete('/:id', (req, res) => {
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

module.exports = router;