const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
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
        validate:{
            validator:  function(v){
                return v > this.rentalDate;
            },
            message: 'The return date must come after the rental date'
        }
    },
    rentalFee:{
        type: Number
    }
});

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id': customerId, 
        'movie._id': movieId 
    });
}

rentalSchema.methods.return = function(){
    const currentMoment = moment();
    
    const nOfDaysRented = currentMoment.diff(this.rentalDate, 'days') ;
    const rentalFee = nOfDaysRented * this.movie.dailyRentalRate;

    this.rentalFee = rentalFee;
    this.returnDate = currentMoment.toDate();
}

const Rental = mongoose.model('Rental', rentalSchema);


function validate(rentalRequest){
    const rentalJoiSchema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(), //ID to genre
    };
    
    return Joi.validate(rentalRequest, rentalJoiSchema);
}

exports.Rental = Rental;
exports.validate = validate;