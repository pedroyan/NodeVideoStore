//Useful for mocking async services on unit tests

const ok = Promise.resolve(1);
ok.then(r => console.log(r));

const p = Promise.reject(new Error('idk lol'));
p.catch(err => console.log(err));