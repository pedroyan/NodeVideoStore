const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User, validate } = require('../models/user');
const debug = require('debug')('app:users');

// Authentication
// Authorization

// Register: POST /api/user {name, email, password}. Email must be unique -> { email: {type: String, unique:true}}
// Login: POST /api/logins


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        //Builds a new model containing only the name and email property
        return res.header('x-auth-token', user.generateAuthToken()).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        debug('An unexpected error ocurred while trying to create user on the DB', error);
        return res.status(500).send('Could not create user');
    }
})

module.exports = router;