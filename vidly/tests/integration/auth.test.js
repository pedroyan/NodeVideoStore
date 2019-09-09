const { User } = require('../../models/user');
const { Genre } = require('../../models/genres');
const request = require('supertest');
let server;

describe('auth middleware', () => {
    let token = '';

    beforeEach(() => { 
        server = require('../../index');
        token = new User({
            name: 'Pedro',
            email: 'pedro@pedro.com',
            password: 'somethingthatdoesntmatter'
        }).generateAuthToken();
     })
    afterEach(async () => { 
        await Genre.deleteMany({});
        //server.close();
    });

    const exec = () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name: 'GenreName'});
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    
    it('should return 400 if token is invalid', async () => {
        token = 'blabla';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

});