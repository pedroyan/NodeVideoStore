const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    //Why I didn't copy the customer schema directly from the customer module?
    //Because on a real world application, this is the only information about a
    //customer that matters to the Rental. By doing it like this, we garantee
    //that if the customer schema grows to 50 properties, only the ones that 
    //matter will be included in the nested document. Updating this afterwards
    //whenever the client updates must be a pain in the ass... lets keep 
    //studying to find out.
    customer: {
        type: new mongoose.Schema({ 
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
        }),
        required: true
    },
    //Tha same goes for the movie property
    movie:{
        type: new mongoose.Schema({
            title:{
                type: String,
                required: true,
                trim: true,
                maxlength: 255
            },
            dailyRentalRate:{
                type: Number,
                default: 0
            }
        }),
        required: true
    },
    rentalDate: {
        type: Date,
        default: Date.now,
    },
    returnDate:{
        type: Date,
        required: true,
        validate:{
            validator:  function(v){
                return v > this.rentalDate;
            },
            message: 'The return date must come after the rental date'
        }
    }
}));

const rentalJoiSchema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(), //ID to genre
    returnDate: Joi.date().required(),
    rentalDate: Joi.date()
};

function validate(rentalRequest){
    return Joi.validate(rentalRequest, rentalJoiSchema);
}

exports.Rental = Rental;
exports.validate = validate;