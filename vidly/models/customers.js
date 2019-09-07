const Joi = require('joi');
const mongoose = require('mongoose');


const customerJoiSchema = {
    name: Joi.string().required(),
    isGold: Joi.boolean(),
    phone: Joi.string().regex(/^(\+)?[0-9]+$/).min(5).required()
};

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        match: /^(\+)?[0-9]+$/
    }
}));

function validateCustomer(customer){
    return Joi.validate(customer, customerJoiSchema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;