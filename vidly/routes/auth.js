const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User } = require('../models/user');
const debug = require('debug')('app:auth');
const config = require('config');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid credentials');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    res.send(user.generateAuthToken());
});

const loginJoiSchema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
};

function validate(request){
    return Joi.validate(request, loginJoiSchema);
}

module.exports = router;