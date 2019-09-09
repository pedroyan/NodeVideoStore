const { Movie } = require('../../models/movies');
const { Rental } = require('../../models/rentals');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const request = require('supertest');

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
    let customerId;
    let movieId;
    let rental;
    let token;

    beforeEach(async () => {
        server = require('../../index');

        token = new User({
            name: 'Pedro',
            email: 'pedro@pedro.com',
            password: 'somethingthatdoesntmatter',
            isAdmin: true
        }).generateAuthToken();
        customerId = mongoose.Types.ObjectId().toHexString();
        
        let dailyRentalRate = 2;
        movie = new Movie({
            title: 'The legend of the bugless code',
            genre: {
                _id: mongoose.Types.ObjectId(),
                name: 'Some Genre'
            },
            dailyRentalRate: dailyRentalRate,
            numberInStock: 1
        });

        movieId = movie._id.toHexString();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Pedro Yan',
                phone: '1234564759'
            },
            movie: {
                _id: movieId,
                title: 'Movie title',
                dailyRentalRate: dailyRentalRate
            },
        });

        const p1 = rental.save();
        const p2 = movie.save();

        await Promise.all([p1, p2]);

    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        //server.close();
    });

    const exec = () => {
        return request(server)
            .post(`/api/returns/`)
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    it('should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = undefined;

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = undefined;

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 404 if no valid rental could be found for the provided ids', async () => {
        movieId = mongoose.Types.ObjectId().toHexString();

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        const updatedRental = await Rental.findByIdAndUpdate(rental._id,
             {$set: {
                 returnDate: Date.now()
             }}, {new: true});

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should normally process the return', async () => {
        const res = await exec();
        
        expect(res.status).toBe(200);

        const rentalInDb = await Rental.findById(rental._id);
        const msDif = new Date() - rentalInDb.returnDate;
        expect(msDif).toBeLessThan(10*1000);

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    });

    //Return 400 if rental already processed
});