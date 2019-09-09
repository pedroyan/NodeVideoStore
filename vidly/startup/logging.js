const config = require('config');
const winston = require('winston');
//require('winston-mongodb'); //maybe disable if test is frozen
require('express-async-errors');

winston.format = winston.format.json();
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
//winston.add(new winston.transports.Console()); //TODO: Properly configure the console outuput (https://github.com/winstonjs/winston)
// winston.add(new winston.transports.MongoDB({
//     db: config.get('connectionString'),
//     level: 'error'
// })); //maybe disable if test is frozen

//Only works in sychronous code
process.on('uncaughtException', ex => {
    winston.error(ex.message, ex);
    process.exit(1);
})

//Only works in async code (aka promises)
process.on('unhandledRejection', ex => {
    winston.error(ex.message, ex);
    process.exit(1);
})

module.exports = function () {

}