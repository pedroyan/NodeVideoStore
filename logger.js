// console.log(`File name: ${__filename}`); //prints full path with the file
// console.log(`Dir name: ${__dirname}`); //prints the path to the file folder

var url = 'http://mylogger.io/log';

function log(message){
    //Send an HTTP request. Nah
    console.log(message);
}

module.exports = log;