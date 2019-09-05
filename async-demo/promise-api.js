//Useful for mocking async services on unit tests

// const ok = Promise.resolve(1);
// ok.then(r => console.log(r));

// const p = Promise.reject(new Error('idk lol'));
// p.catch(err => console.log(err));


//Run multiple promises in "Parallel. Note: those promises don't spawn a new thread. Everything
//is still happening on the same thread, but the thread doesn't get blocked awaiting for results
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Async operation 1...')
        resolve(1);
        //reject(new Error('Async Failure'));
    }, 2000);
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Async operation 2...')
        resolve(3);
    }, 1000);
})

//Works like a barrier. It will once kick off the final promisse when all promises are resolved.
// Promise.all([p1,p2])
//     .then(r => console.log(r))
//     .catch(err => console.log(err));

//Kicks off final promise whenever the first promise finishes
Promise.race([p1,p2])
    .then(r => console.log(r)) //Displays the result of the first fulfilled promise
    .catch(err => console.log(err));

    