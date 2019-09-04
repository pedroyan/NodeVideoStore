//Classes should always be named with uppercase letter
const EventEmmiter = require('events');
function main() {
    //Instances should be named with lowercase letters
    const emmiter = new EventEmmiter();

    //Register an event
    emmiter.on('messageLogged', arg => {
        console.log(`Message logged!`, arg);
    });

    //Raise an event.
    emmiter.emit('messageLogged', {id: 3, message: 'Some message baby'});

    //Under the hood, when an event is raised the emmiter iterates over all the registered listeners 
    //and calls them SYNCHRONOUSLY.
}

module.exports = main;