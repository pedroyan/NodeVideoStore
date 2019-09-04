const EventEmitter = require('events');

var url = 'http://mylogger.io/log';

class Logger extends EventEmitter {
    log(message){
        //Send an HTTP request. Nah
        console.log(message);
        var randomInt = Math.floor(Math.random() * Math.floor(5000));
        this.emit('messageLogged', {message: message, id: randomInt});
    }    
}

module.exports = Logger;