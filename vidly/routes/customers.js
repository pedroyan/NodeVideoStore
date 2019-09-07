const Joi = require('joi');
const express = require('express')
const mongoose = require('mongoose');

const router = express.Router();

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
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

const customerJoiSchema = {
    name: Joi.string().required(),
    isGold: Joi.boolean(),
    phone: Joi.string().regex(/^(\+)?[0-9]+$/).min(5).required()
};

router.post('/', async (req, res) =>{
    const { error } = Joi.validate(req.body, customerJoiSchema)
    if (error) return res.status(400).send(error.details[0].message);

    const newCustomer = new Customer(parseCustomer(req.body));

    try {
        const result = await newCustomer.save();
        res.send(result);
    } catch (error) {
        debug('An error ocurred while saving the customer', error);
        res.send('Could not save customer to database');
    }
});

router.put('/:id', async (req, res) => {
    const { error } = Joi.validate(req.body, customerJoiSchema)
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.params.id) return res.status(404).send(`An ID must be provided to update a customer`);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: parseCustomer(req.body)
    }, {new: true});

    if (!customer) return res.status(404).send(`Could not find any customer with the id ${req.params.id}`);

    res.send(customer);
});

function parseCustomer(requestBody){
    const isGold = requestBody.isGold === 'false'? false : Boolean(requestBody.isGold)
    return {
        name: requestBody.name,
        phone: requestBody.phone,
        isGold: isGold
    };
}


module.exports = router;

