const { User } = require('../../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
    it('should normally generate a Json Web Token', () => {
        const userProperties = {
             _id: new mongoose.Types.ObjectId().toHexString(),
              isAdmin: true 
        };
        const user = new User(userProperties);
        const token = user.generateAuthToken();

        const tokenPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(tokenPayload).toMatchObject(userProperties);
    });
})