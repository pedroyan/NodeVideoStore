const EventEmmitter = require('events');
const emmitter = new EventEmmitter();

emmitter.on('messageLogged', arg => {
    console.log('Event handler received payload', arg);
})

var url = 'http://mylogger.io/log';

function log(message){
    //Send an HTTP request. Nah
    console.log(message);
    emmitter.emit('messageLogged', {message: message, id: Math.random()});
}

module.exports = log;

//To run this type of exports:
// const log = require('./logger');
// log('My message');