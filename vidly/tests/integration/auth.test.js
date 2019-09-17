const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const request = require('supertest');
let server;

describe('/api/auth', () => {
    beforeEach(() => { 
        server = require('../../index');
    });

    describe('POST /' , () => {
        let email = '';
        let password = '';
        let jwtToken = '';

        beforeEach(async () => {
            email = 'pedro@pedro.com',
            password = 'PedroRocks.7392'
            
            const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
            const user = new User({
                name: 'Pedro Yan',
                email: email,
                password: hash
            });

            jwtToken = user.generateAuthToken();

            await user.save();
        });

        afterEach(async ()=>{
            await User.deleteMany({});
        })

        const exec = () => {
            return request(server)
            .post('/api/auth')
            .send({email: email, password: password});
        }

        it('Should return 400 if email is invalid',async () => {
            email = 'wrong';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 400 if password is invalid', async () => {
            password = 'lol';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 400 if password is valid but incorrect', async () => {
            password = 'validpassword123';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 400 if email doesnt exist', async () => {
            email = 'theemailthatneverexisted@pedro.com';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 200 if login is successful', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.text).toBe(jwtToken);
        })
    });

});