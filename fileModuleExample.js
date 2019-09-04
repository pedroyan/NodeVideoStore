const path = require('path');

function run(){
    var pathObject = path.parse(__filename);
    console.log(pathObject);
    console.log(pathObject.base);
}

module.exports.run = run;

//To run this kind of exports: 
// var fileModule = require('./fileModuleExample');
// fileModule.run();