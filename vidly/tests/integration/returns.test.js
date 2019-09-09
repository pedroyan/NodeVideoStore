const { Rental } = require('../../models/rentals');
const mongoose = require('mongoose');

//POST /api/returns {customerId, movieId}

//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if movieId is not provided
//Return 404 if no valid rental could be found for the provided ids
//Return 400 if rental already processed

//Return 200 if OK
//Set the return date
//Calculate rental fee
//Increase the stock
//Return the rental

describe('/api/returns', () => {
    let server;
    let customerId = '';
    let movieId;
    let rental;

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Pedro Yan',
                phone: '1234564759'
            },
            movie: {
                _id: movieId,
                title: 'Movie title',
                dailyRentalRate: 2
            },
        });

        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        //server.close();
    });

    it('should work', async () => {
        const rental = await Rental.findById(rental._id);
        console.log(rental);
        expect(rental).not.toBeNull();
    });
})