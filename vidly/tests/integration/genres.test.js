const request = require('supertest');
const {Genre} = require('../../models/genres');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        await Genre.deleteMany({});
        server.close(); 
    });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'},
                {name: 'genre3'},
            ])

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1'));
            expect(res.body.some(g => g.name === 'genre2'));
            expect(res.body.some(g => g.name === 'genre3'));
        });

        it('should return 404 when a nonexistent id is entered', async () => {
            const res = await request(server).get(`/api/genres/${mongoose.Types.ObjectId().toHexString()}`);
            expect(res.status).toBe(404);
        });

        it('should return a Genre when a valid id is passed', async () => {
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
})