const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}