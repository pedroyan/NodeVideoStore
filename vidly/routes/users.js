const express = require('express');
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

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password // I KNOW! This is a crime. We need to hash the password before saving it to the DB, but for the sake of following the course structure I will save it unhashed
    });

    try{
        await user.save();
        return res.send(user);
    }catch(error){
        debug('An unexpected error ocurred while trying to create user on the DB', error);
        return res.status(500).send('Could not create user');
    }
})

module.exports = router;