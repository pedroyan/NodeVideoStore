const EventEmmitter = require('events');
const log = require('./logger');

const emmitter = new EventEmmitter();
emmitter.on('messageLogged', arg => {
    console.log('Event handler received payload', arg);
})

log('Something to log');
