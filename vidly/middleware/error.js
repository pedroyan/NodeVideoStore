const debug = require('debug')('app:errors');

module.exports = function (err, req, res, next){
    res.status(500).send('Something failed')
    debug('Failed to process request', err);
}