const express = require('express')
const debug = require('debug')('app:customers')
const {Customer, validate} = require('../models/customers');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.send(await Customer.find());
    } catch (error) {
        debug('An error occurred while retrieving the customer list', error)
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.send(await Customer.findById(req.params.id));
    } catch (error) {
        debug(`An error occurred while retrieving the custumer ${req.params.id}`, error)
    }
});

router.post('/', async (req, res) =>{
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const newCustomer = new Customer(parseCustomer(req.body));

    try {
        const result = await newCustomer.save();
        res.send(result);
    } catch (error) {
        debug('An error occurred while saving the customer', error);
        res.send('Could not save customer to database');
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.params.id) return res.status(404).send(`An ID must be provided to update a customer`);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: parseCustomer(req.body)
    }, {new: true});

    if (!customer) return res.status(404).send(`Could not find any customer with the id ${req.params.id}`);

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) return res.status(404).send(`An ID must be provided to update a customer`);

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) return res.status(404).send(`Could not find any customer with the id ${req.params.id}`);
    
    res.send(customer);
})

function parseCustomer(requestBody){
    const isGold = requestBody.isGold === 'false'? false : Boolean(requestBody.isGold)
    return {
        name: requestBody.name,
        phone: requestBody.phone,
        isGold: isGold
    };
}


module.exports = router;