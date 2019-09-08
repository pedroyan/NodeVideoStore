const mongoose = require('mongoose');
const Joi = require('joi');

// Register: POST /api/user {name, email, password}. 
//Email must be unique -> { email: {type: String, unique:true}}
// Login: POST /api/logins

const User = mongoose.model('User', new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    email:{
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    }
}));

const userJoiSchema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(), //ID to genre
    password: Joi.string().min(5).max(255).required(),
};

function validate(user){
    return Joi.validate(user, userJoiSchema);
}


exports.User = User;
exports.validate = validate;