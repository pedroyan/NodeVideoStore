const os = require('os');

function main(){
    //console.log(os.cpus());

    var totalMem = os.totalmem();
    var freeMem = os.freemem();
    console.log(`Total memory: ${totalMem/(1048576*1024)} GB`)
    console.log(`Free memory: ${freeMem/(1048576*1024)} GB`)
    console.log(`Usage percentage: ${(1 - freeMem/totalMem)*100}%`)
}

module.exports = main;