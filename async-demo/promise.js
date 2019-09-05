const p = new Promise((resolve, reject) =>{
    setTimeout(() => {
        //resolve(1);
        reject(new Error('Could not resolve async function'))
    }, 2000);
})

p.then(r => {
    console.log('Promise result', r);
}).catch(err =>{
    console.error('Error received', err);
})