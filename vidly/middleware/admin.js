const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    if(!req.user.isAdmin){
        return res.status(403).send('Access denied. You do not have enough privileges to access this endpoint');
    }

    next();
}