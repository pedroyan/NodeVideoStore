const Logger = require('./logger');
const loggerInstance = new Logger();

loggerInstance.on('messageLogged', arg => {
    console.log('App.js handler reached!', arg);
})

loggerInstance.log('Something to log')
