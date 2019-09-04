const fs = require('fs');

function main(){

    //Sync
    // const files = fs.readdirSync('./');
    // console.log('Sync files:', files);

    fs.readdir('./', function(err, data){
        if(err) console.log('error', err);
        else console.log('Async directories', data);
    })
}

module.exports = main;