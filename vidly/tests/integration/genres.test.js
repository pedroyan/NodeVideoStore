const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        await Genre.deleteMany({});
        await User.deleteMany({});
        //server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
                { name: 'genre3' },
            ])

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1'));
            expect(res.body.some(g => g.name === 'genre2'));
            expect(res.body.some(g => g.name === 'genre3'));
        });

        it('should return 404 when a nonexistent invalid id is entered', async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it('should return 404 when a nonexistent valid id is entered', async () => {
            const res = await request(server).get(`/api/genres/${new mongoose.Types.ObjectId().toHexString()}`);
            expect(res.status).toBe(404);
        });

        it('should return a Genre when a valid id is entered', async () => {
            const payload = {
                name: 'genre1',
                _id: new mongoose.Types.ObjectId().toHexString()
            };
            const genre = new Genre(payload);

            await Genre.collection.insertOne(genre);
            const res = await request(server).get(`/api/genres/${payload._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(payload);
        });
    });

    describe('POST /', () => {

        //Interesting testing guidelines to avoid repetition:
        //Define the happy path, and then in each test, we change one
        //parameter that clearly aligns with the name of the test.
        let genreName = '';
        let token = '';

        beforeEach(() => {
            token = new User({
                name: 'Pedro',
                email: 'pedro@pedro.com',
                password: 'somethingthatdoesntmatter'
            }).generateAuthToken();

            genreName = 'New Genre Name';
        })

        const exec = async () => {
            return await request(server)
                .post(`/api/genres`)
                .set('x-auth-token', token)
                .send({ name: genreName });
        }

        it('should return 401 if no credentials are passed to the API', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if the created genre has less than 3 characters', async () => {
            genreName = '12';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 and save new genre to the DB', async () => {

            const res = await exec();

            expect(res.status).toBe(200);

            const genre = await Genre.findOne({ name: genreName });
            expect(genre).toBeDefined();
            expect(res.body).toMatchObject({ name: genreName });
            expect(res.body).toHaveProperty('_id');

        });
    });

    describe('PUT /', () => {
        let genreName = '';
        let token = '';
        let genreId = '';

        beforeEach(async () => {
            const genre = new Genre({name: 'Existing Genre'});
            await genre.save();
            genreId = genre._id.toHexString();

            token = new User({
                name: 'Pedro',
                email: 'pedro@pedro.com',
                password: 'somethingthatdoesntmatter',
                isAdmin: true
            }).generateAuthToken();

            genreName = 'New Genre Name';
        });

        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${genreId}`)
                .set('x-auth-token', token)
                .send({ name: genreName });
        };

        it('should return 400 if request body is invalid', async () => {
            genreName = '12';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if the genre id is invalid', async () => {
            genreId = '1';
            
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if a nonexistent id is passed', async () => {
            genreId = new mongoose.Types.ObjectId().toHexString();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
        
        it('should return 200 if the genre is updated with a valid payload', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({name: genreName, _id: genreId});
        });
    })

    describe('delete /', () => {
        let token = '';
        let genreId = '';

        beforeEach(async () => {
            const genre = new Genre({name: 'Existing Genre'});
            await genre.save();
            genreId = genre._id.toHexString();

            token = new User({
                name: 'Pedro',
                email: 'pedro@pedro.com',
                password: 'somethingthatdoesntmatter',
                isAdmin: true
            }).generateAuthToken();
        });

        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${genreId}`)
                .set('x-auth-token', token)
                .send({ name: 'New Genre Name' });
        };

        it('should return 404 if the genre id is invalid', async () => {
            genreId = '1';
            
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if a nonexistent id is passed', async () => {
            genreId = new mongoose.Types.ObjectId().toHexString();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
        
        it('should return 200 if the genre is deleted', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(genreId);

            const deleted = await Genre.findById(genreId);
            expect(deleted).toBeFalsy();
        });
    })
})