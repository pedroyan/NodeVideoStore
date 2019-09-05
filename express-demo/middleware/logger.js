module.exports = log

function log (req, res, next) {
    console.log('Logging request...', req.body);
    next();
}