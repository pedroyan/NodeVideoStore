//Classes should always be named with uppercase letter
const EventEmitter = require('events');
function main() {
    //Instances should be named with lowercase letters
    const emitter = new EventEmitter();

    //Register an event
    emitter.on('messageLogged', arg => {
        console.log(`Message logged!`, arg);
    });

    //Raise an event.
    emitter.emit('messageLogged', {id: 3, message: 'Some message baby'});

    //Under the hood, when an event is raised the emmiter iterates over all the registered listeners 
    //and calls them SYNCHRONOUSLY.
}

module.exports = main;