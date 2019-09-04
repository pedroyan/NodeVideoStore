//Resolution order for the require function:
//1 - Node Core
//2 - Local File
//3 - Node Modules
const _ = require('underscore');

var result = _.contains([1,2,3,4,5], 4);
console.log(result);