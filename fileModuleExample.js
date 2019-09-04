require('path');

function run(){
    console.log('File module is up and runniing baby')
}

module.exports.run = run;

//To run this kind of exports: 
// var fileModule = require('./fileModuleExample');
// fileModule.run();