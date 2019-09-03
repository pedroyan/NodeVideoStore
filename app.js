const log = require('./logger');

log('My message');

//Interactive notepad

// //In node, there is no window object, just the global object
// //window.console.log(`I'm part of the global object!`); = Wrong
// global.console.log('Yay'); // = OK
// console.log('YAY2')// = Also OK and equivalent to the above.

//Also variables defined "globaly" in a file does not get added to the global scope. It is instead restricted to this file
// var message = ""
// console.log(global.message); => Prints undefined

//The reason this happens is because Node, the JS Runtime based on V8, wraps each individual file inside an IIFE
//(Immediately Invoked Function Expression) passing to each one of them a series of parameters

